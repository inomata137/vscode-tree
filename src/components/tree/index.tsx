import type { TreeItem } from '@/lib/tree'
import { useRef } from 'react'
import { ItemsList } from './list'
import '@vscode-elements/elements/dist/vscode-icon'

type TreeProps = {
  tree: TreeItem[]
  onSelect?: (item: TreeItem) => void
  onCreate?: (label: string, parent: string, type: 'file' | 'directory') => void
  onRename?: (item: TreeItem, newLabel: string) => void
  onDelete?: (item: TreeItem) => void
}

export function Tree({
  tree,
  onSelect = () => {},
  onCreate = () => {},
  onRename = () => {},
  onDelete = () => {}
}: TreeProps) {
  const rootRef = useRef<HTMLDivElement>(null)

  return (
    <div ref={rootRef} className="h-full w-1/2">
      <ItemsList
        items={tree}
        indentLevel={0}
        rootRef={rootRef}
        onSelect={onSelect}
        onCreate={onCreate}
        onRename={onRename}
        onDelete={onDelete}
      />
    </div>
  )
}
