import type { TreeItem } from '@/lib/tree'
import clsx from 'clsx'
import { Item } from './item'

type TreeItemsListProps = {
  items: TreeItem[]
  indentLevel: number
  className?: string
}

export const ItemsList = ({
  items,
  indentLevel,
  className
}: TreeItemsListProps) => {
  return (
    <ul className={clsx('list-none', className)}>
      {items.map((item) => (
        <Item
          key={itemIdentifier(item)}
          item={item}
          indentLevel={indentLevel}
        />
      ))}
    </ul>
  )
}

function itemIdentifier(item: TreeItem): string {
  const prefix = item.subItems ? 'd' : 'f'
  return `${prefix}-${item.label}`
}
