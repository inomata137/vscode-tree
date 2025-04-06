import { useCallback, useState } from 'react'

export const icons = {
  branch: 'chevron-right',
  leaf: 'file',
  open: 'chevron-down'
} as const

export type TreeItem = {
  label: string
  parent?: WeakRef<TreeItem>
  subItems?: TreeItem[]
}

export type TreeItemWithoutParent = {
  label: string
  subItems?: TreeItemWithoutParent[]
}

export const treeData: TreeItemWithoutParent[] = [
  {
    label: 'scripts',
    subItems: [
      {
        label: 'foo.js'
      },
      {
        label: 'bar.js'
      },
      {
        label: 'baz',
        subItems: [
          {
            label: 'qux.js'
          },
          {
            label: 'quux.js'
          }
        ]
      },
      {
        label: '.gitignore'
      }
    ]
  }
]

export function getFullpath(item: TreeItem): string {
  const parent = item.parent?.deref()
  return parent ? `${getFullpath(parent)}/${item.label}` : item.label
}

export function useTree(
  initialState: TreeItemWithoutParent[] | (() => TreeItemWithoutParent[])
) {
  const [tree, setTreeInternal] = useState(() => {
    const init =
      typeof initialState === 'function' ? initialState() : initialState
    sortItems(init)
    for (const item of init) {
      sortRecursive(item)
    }
    return init.map((item) => attachParent(item))
  })

  const setTree = useCallback(
    (update: (prev: TreeItem[]) => TreeItemWithoutParent[]) => {
      setTreeInternal((prev) => {
        const newTree = update(prev)
        sortItems(newTree)
        for (const item of newTree) {
          sortRecursive(item)
        }
        return newTree.map((item) => attachParent(item))
      })
    },
    []
  )

  return [tree, setTree] as const
}

function attachParent(
  tree: TreeItemWithoutParent,
  parent?: TreeItem
): TreeItem {
  const ret: TreeItem = {
    label: tree.label,
    parent: parent ? new WeakRef(parent) : undefined
  }
  ret.subItems = tree.subItems
    ? tree.subItems.map((item) => attachParent(item, ret))
    : undefined
  return ret
}

/**
 * `TreeItem`または`TreeItemWithoutParent`の配列をIn-placeでソートする
 * @param items ソートする配列
 */
function sortItems<T extends TreeItem[] | TreeItemWithoutParent[]>(items: T) {
  items.sort((a, b) => {
    const dirA = !!a.subItems
    const dirB = !!b.subItems
    if (dirA && !dirB) {
      return -1
    }
    if (!dirA && dirB) {
      return 1
    }
    if (a.label < b.label) {
      return -1
    }
    if (a.label > b.label) {
      return 1
    }
    return 0
  })
}

/**
 *`TreeItem`または`TreeItemWithoutProps`を再帰的にIn-placeでソートする
 * @param item ソートする `TreeItem`または`TreeItemWithoutProps`
 */
function sortRecursive<T extends TreeItem | TreeItemWithoutParent>(item: T) {
  if (item.subItems) {
    sortItems(item.subItems)
    for (const child of item.subItems) {
      sortRecursive(child)
    }
  }
}
