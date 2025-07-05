export function log(...data: unknown[]) {
  if (import.meta.env.MODE === 'development') {
    console.log(...data)
  }
}

function error(...data: unknown[]) {
  if (import.meta.env.MODE === 'development') {
    console.error(...data)
  }
}

export class Logger {
  public name: string
  public disabled = false

  constructor(name: string, disabled = false) {
    this.name = name
    this.disabled = disabled
  }

  log(...data: unknown[]) {
    if (this.disabled) {
      return
    }
    if (typeof data?.[0] === 'string' && data[0].includes('%c')) {
      // If the first argument contains a style, we assume it's a styled log
      // and we use console.log directly to preserve the styles
      data[0] = `[${this.name}] ${data[0]}`
      log(...data)
      return
    }
    log(`[${this.name}]`, ...data)
  }

  error(...data: unknown[]) {
    error(`[${this.name}]`, ...data)
  }
}
