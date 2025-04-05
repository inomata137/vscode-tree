import type { TreeItem } from '@/lib/tree'
import clsx from 'clsx'
import { Item } from './item'

type TreeItemsListProps = {
  items: TreeItem[]
  indentLevel: number
  selectionPath: string | null
  focusPath: string | null
  isActive: boolean
  className?: string
  onSelect: (item: TreeItem) => void
  onFocus: (item: TreeItem) => void
  onActiveChange: (isActive: boolean) => void
  onCreate?: (label: string, parent: string, type: 'file' | 'directory') => void
  onRename?: (item: TreeItem, newLabel: string) => void
  onDelete?: (item: TreeItem) => void
}

export const ItemsList = ({
  items,
  indentLevel,
  selectionPath,
  focusPath,
  isActive,
  className,
  onSelect,
  onFocus,
  onActiveChange,
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
          selectionPath={selectionPath}
          focusPath={focusPath}
          isActive={isActive}
          onSelect={onSelect}
          onFocus={onFocus}
          onActiveChange={onActiveChange}
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
