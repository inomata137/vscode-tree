import type { TreeItem } from '@/lib/tree'
import { AlertDialog } from 'radix-ui'

type DeleteDialogProps = {
  item: TreeItem
  open: boolean
  onOpenChange: (open: boolean) => void
  onDelete?: (item: TreeItem) => void
}

export function DeleteDialog({
  item,
  open,
  onOpenChange,
  onDelete
}: DeleteDialogProps) {
  return (
    <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 bg-black opacity-30" />
        <AlertDialog.Content className="w-96 fixed top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] border border-[var(--vscode-menu-border)] rounded-md px-6 py-4 bg-[var(--vscode-menu-background)]">
          <AlertDialog.Title className="mb-1 font-bold text-xl">
            Delete '{item.label}'
          </AlertDialog.Title>
          <AlertDialog.Description className="mb-3">
            This action cannot be undone.
          </AlertDialog.Description>
          <div className="flex justify-end gap-6">
            <AlertDialog.Cancel asChild>
              <vscode-button
                secondary
                className="px-2.5 py-1 border border-[var(--vscode-button-border)]"
              >
                Cancel
              </vscode-button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <vscode-button
                onClick={() => onDelete?.(item)}
                autoFocus
                className="px-2.5 py-1 border border-[var(--vscode-button-border)]"
              >
                Delete
              </vscode-button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  )
}
