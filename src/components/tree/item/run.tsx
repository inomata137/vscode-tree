import type { TreeItem } from '@/lib/tree'
import { Dialog } from 'radix-ui'
import { useRef } from 'react'

type RunDialogProps = {
  item: TreeItem
  open: boolean
  onOpenChange: (open: boolean) => void
  onRun?: (item: TreeItem, delay: number) => void
}

export function RunDialog({ item, open, onOpenChange, onRun }: RunDialogProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const runItem = () => {
    const delay = Number.parseInt(inputRef.current?.value || '0')
    window.alert(`Run ${item.label} with delay ${delay}`)
    onRun?.(item, delay)
  }
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
        <Dialog.Content className="fixed top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] border border-[var(--vscode-menu-border)] rounded-md px-6 py-4 bg-[var(--vscode-menu-background)]">
          <Dialog.Title className="mb-1 font-bold text-xl">
            Run {item.label}
          </Dialog.Title>
          <Dialog.Description className="mb-3">
            Set activation delay and run the script
          </Dialog.Description>
          <fieldset className="flex items-center justify-between gap-4">
            <label htmlFor="delay">Delay (msec):</label>
            <input
              ref={inputRef}
              type="number"
              name="delay"
              defaultValue={0}
              step={1}
              min={0}
              className="outline outline-solid outline-[var(--vscode-settings-numberInputBorder)] focus:outline-[var(--vscode-focusBorder)] rounded-[1px] px-1.5 py-0.5 bg-[var(--vscode-settings-numberInputBackground)] text-right text-sm/[1.4em] text-[var(--vscode-settings-numberInputForeground)]"
            />
          </fieldset>
          <div className="flex justify-end mt-4">
            <Dialog.Close asChild>
              <vscode-button
                className="px-[10px] py-[5px] border border-[var(--vscode-button-border)] leading-[1.4em]"
                onClick={runItem}
              >
                Run
              </vscode-button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
