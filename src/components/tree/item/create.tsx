import { icons } from '@/lib/tree'
import { RenameInput } from './rename'

type CreateItemProps = {
  indentLevel: number
  itemType: 'file' | 'directory'
  prefix: string
  onClose: () => void
  onCreate?: (label: string, parent: string, type: 'file' | 'directory') => void
}

export function CreateItem({
  indentLevel,
  itemType,
  prefix,
  onClose,
  onCreate
}: CreateItemProps) {
  const icon = itemType === 'file' ? icons.leaf : icons.branch
  const onComplete = (label: string) => {
    if (label) {
      onCreate?.(label, prefix, itemType)
    }
    onClose()
  }
  return (
    <div
      className="flex items-center justify-start gap-1.5 cursor-pointer hover:bg-[var(--vscode-list-hoverBackground)]"
      style={{
        paddingLeft: indentLevel * 8
      }}
    >
      <vscode-icon name={icon} />
      <RenameInput defaultValue="" className="flex-1" onComplete={onComplete} />
    </div>
  )
}
