import { Tree } from '@/components/tree'
import {
  type TreeItem,
  type TreeItemWithoutParent,
  getFullpath,
  treeData as treeDataUnsorted,
  useTree
} from '@/lib/tree'
import { theme } from '@/themes/dark-v2'
import { useCallback } from 'react'
import '@vscode-elements/elements/dist/vscode-icon'

function App() {
  const [tree, setTree] = useTree(() => treeDataUnsorted)

  const onSelect = useCallback((item: TreeItem) => {
    // console.log('Select', item)
  }, [])

  const onCreate = useCallback(
    (label: string, parent: string, type: 'file' | 'directory') => {
      const updateRecursive = (item: TreeItem): TreeItemWithoutParent => {
        const fullPath = getFullpath(item)
        if (fullPath === parent) {
          return {
            label: item.label,
            subItems: (item.subItems ?? []).concat({
              label,
              subItems: type === 'directory' ? [] : undefined
            })
          }
        }
        if (parent.startsWith(fullPath)) {
          return {
            label: item.label,
            subItems: item.subItems?.map(updateRecursive)
          }
        }
        return {
          label: item.label,
          subItems: item.subItems
        }
      }
      setTree((prev) => prev.map(updateRecursive))
    },
    [setTree]
  )

  const onRename = useCallback(
    (renamedItem: TreeItem, newLabel: string) => {
      const cloneRecursive = (item: TreeItem): TreeItemWithoutParent => ({
        label: item.label,
        subItems: item.subItems?.map(cloneRecursive)
      })
      const updateRecursive = (item: TreeItem): TreeItemWithoutParent => {
        if (item === renamedItem) {
          return {
            label: newLabel,
            subItems: item.subItems?.map(cloneRecursive)
          }
        }
        return {
          label: item.label,
          subItems: item.subItems?.map(updateRecursive)
        }
      }
      setTree((prev) => prev.map(updateRecursive))
    },
    [setTree]
  )

  const onDelete = useCallback(
    (deletedItem: TreeItem) => {
      const updateRecursive = (items: TreeItem[]): TreeItemWithoutParent[] => {
        return items
          .filter((item) => item !== deletedItem)
          .map((item) => ({
            label: item.label,
            subItems: item.subItems ? updateRecursive(item.subItems) : undefined
          }))
      }
      setTree((prev) => updateRecursive(prev))
    },
    [setTree]
  )

  return (
    <>
      <style>
        {`:root {${theme.map(([key, val]) => `${key}: ${val};`).join('\n')}}`}
      </style>
      <main className="h-screen">
        <Tree
          tree={tree}
          onSelect={onSelect}
          onCreate={onCreate}
          onRename={onRename}
          onDelete={onDelete}
        />
      </main>
    </>
  )
}

export default App
