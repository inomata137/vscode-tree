import type { TreeItem } from '@/lib/tree'
import { ContextMenu } from 'radix-ui'
import type { ReactNode } from 'react'

type ItemWithContextMenuProps = {
  item: TreeItem
  cmdKeyAvailable: boolean
  onOpenChange: (open: boolean) => void
  onSelectNewFile: () => void
  onSelectNewDirectory: () => void
  onSelectRun: () => void
  onSelectRename: () => void
  onSelectDelete: () => void
  children: ReactNode
}

export function ItemWithContextMenu({
  item,
  cmdKeyAvailable,
  onOpenChange,
  onSelectNewFile,
  onSelectNewDirectory,
  onSelectRun,
  onSelectRename,
  onSelectDelete,
  children
}: ItemWithContextMenuProps) {
  return (
    <ContextMenu.Root onOpenChange={onOpenChange}>
      <ContextMenu.Trigger asChild>{children}</ContextMenu.Trigger>
      <ContextMenu.Content className="w-60 p-1 border border-[var(--vscode-menu-border)] rounded-md bg-[var(--vscode-menu-background)] text-[var(--vscode-menu-foreground)] text-sm select-none">
        {item.subItems && (
          <>
            <ContextMenu.Item
              className="flex items-center justify-start px-3 py-0.5 rounded focus:bg-[var(--vscode-menu-selectionBackground)] focus:outline-none cursor-pointer"
              onSelect={onSelectNewFile}
            >
              <span>New File...</span>
            </ContextMenu.Item>
            <ContextMenu.Item
              className="flex items-center justify-start px-3 py-0.5 rounded focus:bg-[var(--vscode-menu-selectionBackground)] focus:outline-none cursor-pointer"
              onSelect={onSelectNewDirectory}
            >
              <span>New Folder...</span>
            </ContextMenu.Item>
            <ContextMenu.Separator className="my-1 border-b border-[var(--vscode-menu-separatorBackground)]" />
          </>
        )}
        {!item.subItems && item.label.endsWith('.js') && (
          <>
            <ContextMenu.Item
              className="flex items-center justify-start px-3 py-0.5 rounded focus:bg-[var(--vscode-menu-selectionBackground)] focus:outline-none cursor-pointer"
              onSelect={onSelectRun}
            >
              <span>Run</span>
            </ContextMenu.Item>
            <ContextMenu.Separator className="my-1 border-b border-[var(--vscode-menu-separatorBackground)]" />
          </>
        )}
        <ContextMenu.Item
          className="flex items-center justify-between px-3 py-0.5 rounded focus:bg-[var(--vscode-menu-selectionBackground)] focus:outline-none cursor-pointer"
          onSelect={onSelectRename}
        >
          <span>Rename...</span>
          <span className="opacity-70">{cmdKeyAvailable ? '↵' : 'F2'}</span>
        </ContextMenu.Item>
        <ContextMenu.Item
          className="flex items-center justify-between px-3 py-0.5 rounded focus:bg-[var(--vscode-menu-selectionBackground)] focus:outline-none cursor-pointer"
          onSelect={onSelectDelete}
        >
          <span>Delete Permanently</span>
          <span className="opacity-70">
            {cmdKeyAvailable ? '⌘⌫' : 'Delete'}
          </span>
        </ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu.Root>
  )
}
