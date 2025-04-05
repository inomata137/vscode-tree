import { hasCmdKey } from '@/lib/os'
import { type TreeItem, getFullpath, icons } from '@/lib/tree'
import clsx from 'clsx'
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
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
  selectionPath: string | null
  focusPath: string | null
  isActive: boolean
  onSelect: (item: TreeItem) => void
  onFocus: (item: TreeItem) => void
  onActiveChange: (isActive: boolean) => void
  onCreate?: (label: string, parent: string, type: 'file' | 'directory') => void
  onRename?: (item: TreeItem, newLabel: string) => void
  onDelete?: (item: TreeItem) => void
}

export const Item = memo(function Item({
  item,
  indentLevel,
  selectionPath,
  focusPath,
  isActive,
  onSelect,
  onFocus,
  onActiveChange,
  onCreate,
  onRename,
  onDelete
}: TreeItemProps) {
  const [editable, setEditable] = useState(false)
  const [isChildrenOpen, setIsChildrenOpen] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [runDialogOpen, setRunDialogOpen] = useState(false)
  const [newChildItem, setNewChildItem] = useState<'file' | 'directory' | null>(
    null
  )
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
  const isContextMenuOpen = useRef(false)
  const itemRef = useRef<HTMLDivElement>(null)

  const isSelected = selectionPath === fullPath
  const isFocused = focusPath === fullPath
  const icon = item.subItems
    ? isChildrenOpen
      ? icons.open
      : icons.branch
    : icons.leaf

  const cls = editable
    ? ''
    : clsx(
        isFocused &&
          (isActive || isContextMenuOpen.current) &&
          'outline outline-[var(--vscode-list-focusOutline)]',
        isSelected &&
          (isActive
            ? 'bg-[var(--vscode-list-activeSelectionBackground)]'
            : 'bg-[var(--vscode-list-inactiveSelectionBackground)]'),
        !isSelected && 'hover:bg-[var(--vscode-list-hoverBackground)]'
      )

  useEffect(() => {
    if (isFocused) {
      if (isContextMenuOpen.current) {
        return
      }
      const startRename = (e: KeyboardEvent) => {
        if (isContextMenuOpen.current) {
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
  }, [isFocused, cmdKeyAvailable])

  useEffect(() => {
    if (!isSelected || editable || isContextMenuOpen.current) {
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
  }, [isSelected, editable, cmdKeyAvailable])

  const selectItem = () => {
    if (item.subItems) {
      setIsChildrenOpen((v) => !v)
    }
    onSelect(item)
  }

  const completeRename = (newLabel: string) => {
    setEditable(false)
    if (newLabel !== item.label) {
      onRename?.(item, newLabel)
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
    onFocus(item)
    // context menuが閉じるのを待ってから開かないとfocusが移らない
    window.setTimeout(() => setEditable(true))
  }

  const onSelectDelete = () => {
    setDeleteDialogOpen(true)
  }

  const onContextMenuOpenChange = useCallback(
    (open: boolean) => {
      isContextMenuOpen.current = open
      onFocus(item)
      onActiveChange(!open)
    },
    [item, onFocus, onActiveChange]
  )

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
          selectionPath={selectionPath}
          focusPath={focusPath}
          isActive={isActive}
          className={isChildrenOpen ? '' : 'hidden'}
          onSelect={onSelect}
          onFocus={onFocus}
          onActiveChange={onActiveChange}
          onCreate={onCreate}
          onRename={onRename}
          onDelete={onDelete}
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
          selectionPath={selectionPath}
          focusPath={focusPath}
          isActive={isActive}
          className={isChildrenOpen ? '' : 'hidden'}
          onSelect={onSelect}
          onFocus={onFocus}
          onActiveChange={onActiveChange}
          onCreate={onCreate}
          onRename={onRename}
          onDelete={onDelete}
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
