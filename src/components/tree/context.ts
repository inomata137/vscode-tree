import type { TreeItem } from '@/lib/tree'
import { type RefObject, createContext, useContext } from 'react'

type TreeContextType = {
  tree: TreeItem[]
  rootRef: RefObject<HTMLElement | null>
  onSelect: (item: TreeItem) => void
  onCreate: (label: string, parent: string, type: 'file' | 'directory') => void
  onRename: (item: TreeItem, newLabel: string) => void
  onDelete: (item: TreeItem) => void
}

const TreeContext = createContext<TreeContextType>({
  tree: [],
  rootRef: { current: null },
  onSelect: () => {},
  onCreate: () => {},
  onRename: () => {},
  onDelete: () => {}
})

export const TreeContextProvider = TreeContext.Provider

export const useTreeContext = () => useContext(TreeContext)
