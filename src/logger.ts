export function log(...data: any[]) {
  if (import.meta.env.MODE === 'development') {
    console.log(...data)
  }
}

function error(...data: any[]) {
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
