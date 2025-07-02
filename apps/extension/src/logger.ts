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

  constructor(name: string) {
    this.name = name
  }

  log(...data: unknown[]) {
    log(`[${this.name}]`, ...data)
  }

  error(...data: unknown[]) {
    error(`[${this.name}]`, ...data)
  }
}
