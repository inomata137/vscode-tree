import { useMemo } from 'react'

export type OsType = 'linux' | 'windows' | 'macos' | 'ios' | 'android'

export const type = (): OsType => 'macos'

export const hasCmdKey = (): boolean => {
  const osType = type()
  return osType === 'macos' || osType === 'ios'
}

export const useCtrlCmd = () => {
  const isCtrlCmd: (e: KeyboardEvent) => boolean = useMemo(() => {
    const cmdKeyAvailable = hasCmdKey()
    return (e: KeyboardEvent) => (cmdKeyAvailable ? e.metaKey : e.ctrlKey)
  }, [])
  return isCtrlCmd
}
