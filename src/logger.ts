export function log(...data: any[]) {
  if (import.meta.env.MODE === 'development') {
    console.log(...data)
  }
}

export class Logger {
  public name: string

  constructor(name: string) {
    this.name = name
  }

  log(...data: any[]) {
    log(`[${this.name}]`, ...data)
  }
}
