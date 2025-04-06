import type { TreeItem } from '@/lib/tree'
import { useMemo, useRef } from 'react'
import { TreeContextProvider } from './context'
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
  const context = useMemo(
    () => ({
      tree,
      rootRef,
      onSelect,
      onCreate,
      onRename,
      onDelete
    }),
    [tree, onSelect, onCreate, onRename, onDelete]
  )

  return (
    <div ref={rootRef} className="h-full w-1/2">
      <TreeContextProvider value={context}>
        <ItemsList items={tree} indentLevel={0} />
      </TreeContextProvider>
    </div>
  )
}
