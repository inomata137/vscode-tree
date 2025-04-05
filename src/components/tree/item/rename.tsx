import { useEffect, useRef } from 'react'

type RenameInputProps = {
  defaultValue: string
  className?: string
  onComplete: (newLabel: string) => void
}

const RENAME_INPUT_LABEL = 'newLabel'

export function RenameInput({
  defaultValue,
  className,
  onComplete
}: RenameInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const onEnter = (e: FormData) => {
    const newLabel = e.get(RENAME_INPUT_LABEL)?.toString() ?? defaultValue
    onComplete(newLabel)
  }

  useEffect(() => {
    const currentInput = inputRef.current
    if (currentInput) {
      const lastDotAt = defaultValue.lastIndexOf('.')
      const selectionEnd = lastDotAt < 1 ? defaultValue.length : lastDotAt
      currentInput.setSelectionRange(0, selectionEnd)
    }
  }, [defaultValue])

  useEffect(() => {
    const completeRename = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onComplete(defaultValue)
      }
    }
    window.addEventListener('keydown', completeRename)

    const close = (e: MouseEvent) => {
      if (inputRef.current?.contains(e.target as Node)) {
        return
      }
      onComplete(defaultValue)
    }
    window.addEventListener('click', close)
    return () => {
      window.removeEventListener('keydown', completeRename)
      window.removeEventListener('click', close)
    }
  }, [defaultValue, onComplete])

  return (
    <form action={onEnter} className={className}>
      <input
        ref={inputRef}
        type="text"
        name={RENAME_INPUT_LABEL}
        className="w-full outline outline-solid outline-[var(--vscode-list-focusOutline)] rounded-[1px] bg-[var(--vscode-list-inactiveSelectionBackground)]"
        defaultValue={defaultValue}
        spellCheck={false}
        autoComplete="off"
        autoFocus
      />
    </form>
  )
}
