import { ConsoleLogger, Injectable } from '@nestjs/common'

@Injectable()
export class ApiLogger extends ConsoleLogger {
  private _environment: string

  constructor() {
    super()
    this._environment = (process.env.APP_ENV || '').toUpperCase()
    super.setLogLevels(this._environment === 'prod' ? ['error', 'warn'] : ['log', 'debug', 'error', 'warn', 'verbose'])
  }

  log(message: any, context?: any) {
    super.log(`[${this._environment || ''}] ${this.toReadable(message)} ${this.toReadable(context || '')}`)
  }

  error(err: any, stack?: any, context?: string) {
    super.error(`[${this._environment || ''}] ${err}`)
  }

  warn(message: any, context?: any) {
    super.warn(`[${this._environment || ''}] ${this.toReadable(message)} ${this.toReadable(context || '')}`)
  }

  debug(message: any, context?: any) {
    super.debug(`[${this._environment || ''}] ${this.toReadable(message)} ${this.toReadable(context || '')}`)
  }

  private toReadable(message: any): string {
    return JSON.stringify(message, this.circularReplacer())
      ?.replace(/^"|"$/g, '')
      .replace(/\\n|\\t/g, '')
      .replace(/\\/g, '')
  }

  private circularReplacer() {
    const seen = new WeakSet()
    return (key: any, value: any) => {
      if (typeof value === 'object' && value !== null) {
        if (seen.has(value)) {
          return 'Object'
        }
        seen.add(value)
      }
      return value
    }
  }
}
