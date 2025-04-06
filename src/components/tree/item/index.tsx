import { hasCmdKey } from '@/lib/os'
import { type TreeItem, getFullpath, icons } from '@/lib/tree'
import clsx from 'clsx'
import { memo, useEffect, useMemo, useRef, useState } from 'react'
import { useTreeContext } from '../context'
import { ItemsList } from '../list'
import { ItemWithContextMenu } from './contextmenu'
import { CreateItem } from './create'
import { DeleteDialog } from './delete'
import { RenameInput } from './rename'
import { RunDialog } from './run'

import '@vscode-elements/elements/dist/vscode-button'

type TreeItemProps = {
  item: TreeItem
  indentLevel: number
}

export const Item = memo(function Item({ item, indentLevel }: TreeItemProps) {
  const { rootRef, onSelect, onCreate, onRename, onDelete } = useTreeContext()
  const [isSelected, setIsSelected] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [isActive, setIsActive] = useState(true)
  const [editable, setEditable] = useState(false)
  const [isChildrenOpen, setIsChildrenOpen] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [runDialogOpen, setRunDialogOpen] = useState(false)
  const [newChildItem, setNewChildItem] = useState<'file' | 'directory' | null>(
    null
  )
  const [contextMenuOpen, setContextMenuOpen] = useState(false)
  const cmdKeyAvailable = useMemo(() => hasCmdKey(), [])
  const fullPath = useMemo(() => getFullpath(item), [item])
  const { childDirectories, childFiles } = useMemo(() => {
    if (!item.subItems) {
      return {
        childFiles: null,
        childDirectories: null
      }
    }
    const childFiles: TreeItem[] = []
    const childDirectories: TreeItem[] = []
    for (const child of item.subItems ?? []) {
      if (child.subItems) {
        childDirectories.push(child)
      } else {
        childFiles.push(child)
      }
    }
    return {
      childFiles,
      childDirectories
    }
  }, [item.subItems])
  const itemRef = useRef<HTMLDivElement>(null)

  const icon = item.subItems
    ? isChildrenOpen
      ? icons.open
      : icons.branch
    : icons.leaf

  const cls = editable
    ? ''
    : clsx(
        isFocused &&
          (contextMenuOpen || isActive) &&
          'outline outline-[var(--vscode-list-focusOutline)]',
        isSelected &&
          (isActive
            ? 'bg-[var(--vscode-list-activeSelectionBackground)]'
            : 'bg-[var(--vscode-list-inactiveSelectionBackground)]'),
        !isSelected && 'hover:bg-[var(--vscode-list-hoverBackground)]'
      )

  // キーボードからのRename開始
  useEffect(() => {
    if (isFocused) {
      if (contextMenuOpen) {
        return
      }
      const startRename = (e: KeyboardEvent) => {
        if (contextMenuOpen) {
          return
        }
        if (cmdKeyAvailable ? e.key === 'Enter' : e.key === 'F2') {
          setEditable(true)
        }
      }
      window.addEventListener('keypress', startRename)
      return () => {
        window.removeEventListener('keypress', startRename)
      }
    }
    setEditable(false)
  }, [isFocused, cmdKeyAvailable, contextMenuOpen])

  // キーボードからのDelete開始
  useEffect(() => {
    if (!isSelected || editable || contextMenuOpen) {
      return
    }
    const openDeleteDialog = (e: KeyboardEvent) => {
      if (cmdKeyAvailable) {
        if (e.metaKey && e.key === 'Backspace') {
          setDeleteDialogOpen(true)
        }
      } else {
        if (e.key === 'Delete') {
          setDeleteDialogOpen(true)
        }
      }
    }
    window.addEventListener('keydown', openDeleteDialog)
    return () => {
      window.removeEventListener('keydown', openDeleteDialog)
    }
  }, [isSelected, editable, cmdKeyAvailable, contextMenuOpen])

  // 外側をクリックしたときの処理
  useEffect(() => {
    const currentRoot = rootRef.current
    const currentItem = itemRef.current
    if (!currentRoot || !currentItem) {
      return
    }
    if (!isSelected && !isFocused) {
      return
    }
    const onClickOutside = (e: MouseEvent) => {
      const target = e.target as Node
      if (currentItem.contains(target)) {
        return
      }
      setIsFocused(false)
      if (currentRoot.contains(target)) {
        setIsSelected(false)
      } else {
        setIsActive(false)
      }
    }
    window.addEventListener('click', onClickOutside)
    return () => {
      window.removeEventListener('click', onClickOutside)
    }
  }, [rootRef, isSelected, isFocused])

  // 外側で右クリックしたときの処理
  useEffect(() => {
    const currentRoot = rootRef.current
    const currentItem = itemRef.current
    if (
      !currentRoot ||
      !currentItem ||
      contextMenuOpen ||
      runDialogOpen ||
      deleteDialogOpen
    ) {
      return
    }
    if (!isSelected && !isFocused) {
      return
    }
    const onContextMenuOutside = (e: MouseEvent) => {
      if (currentItem.contains(e.target as Node)) {
        return
      }
      setIsFocused(false)
    }
    window.addEventListener('contextmenu', onContextMenuOutside)
    return () => {
      window.removeEventListener('contextmenu', onContextMenuOutside)
    }
  }, [
    rootRef,
    contextMenuOpen,
    runDialogOpen,
    deleteDialogOpen,
    isSelected,
    isFocused
  ])

  const selectItem = () => {
    if (item.subItems) {
      setIsChildrenOpen((v) => !v)
    }
    setIsSelected(true)
    setIsFocused(true)
    setIsActive(true)
    onSelect(item)
  }

  const completeRename = (newLabel: string) => {
    setEditable(false)
    if (newLabel !== item.label) {
      onRename(item, newLabel)
    }
  }

  const onSelectRun = () => {
    setRunDialogOpen(true)
  }

  const onSelectNewFile = () => {
    // context menuが閉じるのを待ってから開かないと、context menuのクリックを誤検知して開いた瞬間に閉じてしまう
    window.setTimeout(() => {
      setIsChildrenOpen(true)
      setNewChildItem('file')
    })
  }

  const onSelectNewDirectory = () => {
    // context menuが閉じるのを待ってから開かないと、context menuのクリックを誤検知して開いた瞬間に閉じてしまう
    window.setTimeout(() => {
      setIsChildrenOpen(true)
      setNewChildItem('directory')
    })
  }

  const onSelectRename = () => {
    setIsFocused(true)
    // context menuが閉じるのを待ってから開かないとfocusが移らない
    window.setTimeout(() => setEditable(true))
  }

  const onSelectDelete = () => {
    setDeleteDialogOpen(true)
  }

  const onContextMenuOpenChange = (open: boolean) => {
    if (open) {
      setIsFocused(true)
      setIsActive(true)
    }
    setContextMenuOpen(open)
  }

  console.log(fullPath, 'Item render')

  return (
    <li>
      <ItemWithContextMenu
        item={item}
        cmdKeyAvailable={cmdKeyAvailable}
        onOpenChange={onContextMenuOpenChange}
        onSelectNewFile={onSelectNewFile}
        onSelectNewDirectory={onSelectNewDirectory}
        onSelectRun={onSelectRun}
        onSelectRename={onSelectRename}
        onSelectDelete={onSelectDelete}
      >
        <div
          ref={itemRef}
          className={clsx(
            'flex items-center justify-start gap-1.5 cursor-pointer',
            cls
          )}
          style={{
            paddingLeft: indentLevel * 8
          }}
          onClick={selectItem}
        >
          <vscode-icon name={icon} />
          {editable ? (
            <RenameInput
              defaultValue={item.label}
              className="flex-1"
              onComplete={completeRename}
            />
          ) : (
            <span className="flex-1 select-none">{item.label}</span>
          )}
        </div>
      </ItemWithContextMenu>
      {newChildItem === 'directory' && (
        <CreateItem
          indentLevel={indentLevel + 1}
          itemType="directory"
          prefix={fullPath}
          onClose={() => setNewChildItem(null)}
          onCreate={onCreate}
        />
      )}
      {childDirectories && (
        <ItemsList
          items={childDirectories}
          indentLevel={indentLevel + 1}
          className={isChildrenOpen ? '' : 'hidden'}
        />
      )}
      {newChildItem === 'file' && (
        <CreateItem
          indentLevel={indentLevel + 1}
          itemType="file"
          prefix={fullPath}
          onClose={() => setNewChildItem(null)}
          onCreate={onCreate}
        />
      )}
      {childFiles && (
        <ItemsList
          items={childFiles}
          indentLevel={indentLevel + 1}
          className={isChildrenOpen ? '' : 'hidden'}
        />
      )}
      <DeleteDialog
        open={deleteDialogOpen}
        item={item}
        onOpenChange={setDeleteDialogOpen}
        onDelete={onDelete}
      />
      <RunDialog
        item={item}
        open={runDialogOpen}
        onOpenChange={setRunDialogOpen}
      />
    </li>
  )
})
