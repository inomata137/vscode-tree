import { type TreeItem, getFullpath } from '@/lib/tree'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ItemsList } from './list'
import '@vscode-elements/elements/dist/vscode-icon'

type TreeProps = {
  tree: TreeItem
  onSelect?: (item: TreeItem) => void
  onCreate?: (label: string, parent: string, type: 'file' | 'directory') => void
  onRename?: (item: TreeItem, newLabel: string) => void
  onDelete?: (item: TreeItem) => void
}

export function Tree({
  tree,
  onSelect,
  onCreate,
  onRename,
  onDelete
}: TreeProps) {
  const [selectionPath, setSelectionPath] = useState<string | null>(null)
  const [focusPath, setFocusPath] = useState<string | null>(null)
  const [isActive, setIsActive] = useState(true)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!rootRef.current) {
        return
      }
      const isInside = rootRef.current.contains(e.target as Node)
      setIsActive(isInside)
      if (!isInside) {
        setFocusPath(null)
      }
    }
    window.addEventListener('click', handler)
    return () => {
      window.removeEventListener('click', handler)
    }
  }, [])

  const selectItem = useCallback(
    (item: TreeItem) => {
      const value = getFullpath(item)
      setSelectionPath(value)
      setFocusPath(value)
      onSelect?.(item)
    },
    [onSelect]
  )

  const focusItem = useCallback((item: TreeItem) => {
    const value = getFullpath(item)
    setFocusPath(value)
  }, [])

  const onRootClick = (e: React.MouseEvent) => {
    if (e.target !== rootRef.current) {
      return
    }
    setSelectionPath(null)
    setFocusPath(null)
  }

  return (
    <div ref={rootRef} className="h-full w-1/2" onClick={onRootClick}>
      <ItemsList
        items={[tree]}
        indentLevel={0}
        selectionPath={selectionPath}
        focusPath={focusPath}
        isActive={isActive}
        onSelect={selectItem}
        onFocus={focusItem}
        onActiveChange={setIsActive}
        onCreate={onCreate}
        onRename={onRename}
        onDelete={onDelete}
      />
    </div>
  )
}
