export type EnvironmentType = 'browser' | 'shell'
export type BrowserType = 'chrome' | 'firefox' | 'edge' | 'browser'
export type ShellType = 'linux' | 'mac' | 'windows' | 'shell'

export function detectEnvironment():
  | { type: 'browser'; browser: BrowserType }
  | { type: 'shell'; os: ShellType } {
  if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
    // Running in a browser
    const userAgent = navigator.userAgent.toLowerCase()

    if (userAgent.includes('chrome') && !userAgent.includes('edg')) {
      return { type: 'browser', browser: 'chrome' }
    }
    if (userAgent.includes('firefox')) {
      return { type: 'browser', browser: 'firefox' }
    }
    if (userAgent.includes('edg')) {
      return { type: 'browser', browser: 'edge' }
    }

    return { type: 'browser', browser: 'browser' }
  } else {
    // Running in a shell (Node.js or similar)
    const platform = process.platform

    if (platform === 'linux') {
      return { type: 'shell', os: 'linux' }
    }
    if (platform === 'darwin') {
      return { type: 'shell', os: 'mac' }
    }
    if (platform === 'win32') {
      return { type: 'shell', os: 'windows' }
    }

    return { type: 'shell', os: 'shell' }
  }
}
