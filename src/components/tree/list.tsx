import type { TreeItem } from '@/lib/tree'
import clsx from 'clsx'
import { Item } from './item'

type TreeItemsListProps = {
  items: TreeItem[]
  indentLevel: number
  className?: string
  rootRef: React.RefObject<HTMLElement | null>
  onSelect: (item: TreeItem) => void
  onCreate: (label: string, parent: string, type: 'file' | 'directory') => void
  onRename: (item: TreeItem, newLabel: string) => void
  onDelete: (item: TreeItem) => void
}

export const ItemsList = ({
  items,
  indentLevel,
  className,
  rootRef,
  onSelect,
  onCreate,
  onRename,
  onDelete
}: TreeItemsListProps) => {
  return (
    <ul className={clsx('list-none', className)}>
      {items.map((item) => (
        <Item
          key={itemIdentifier(item)}
          item={item}
          indentLevel={indentLevel}
          rootRef={rootRef}
          onSelect={onSelect}
          onCreate={onCreate}
          onRename={onRename}
          onDelete={onDelete}
        />
      ))}
    </ul>
  )
}

function itemIdentifier(item: TreeItem): string {
  const prefix = item.subItems ? 'd' : 'f'
  return `${prefix}-${item.label}`
}
