import { decode, Jwt } from 'jsonwebtoken'
import * as R from 'ramda'

export class Helpers {
  static isEmptyObject(obj: any): boolean {
    if (!obj) {
      return true
    }
    return R.isEmpty(obj)
  }

  static findArrayObject(obj: any[], prop: string, value: any) {
    return R.find(R.propEq(prop, value))(obj)
  }

  static secToDate(sec: number): Date {
    return new Date(sec * 1000)
  }

  static isNumeric(value: any): boolean {
    return typeof value === 'number'
  }

  static camelToSnakeCase(str: string): string {
    const fn = (s: string) => s.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
    return `${str[0].toUpperCase()}${fn(str.substring(1))}`.toUpperCase()
  }

  static decodeJwt(token: string): Jwt {
    return decode(token, { complete: true })
  }

  static encodeToBase64(value: string): string {
    return Buffer.from(value).toString('base64')
  }

  static decodeBase64(base64: string): string {
    return Buffer.from(base64, 'base64').toString()
  }

  static delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  static getTzString(value: Date | number, offset = 7): string {
    if (value === undefined) {
      return undefined
    }

    if (value === null) {
      return null
    }

    const date = new Date(value)
    date.setHours(date.getHours() + offset)
    return date.toISOString().replace('Z', '')
  }

  static getUtcDate(value: string, offset = 7): Date {
    if (this.isEmptyObject(value)) {
      return null
    }
    const date = new Date(value)
    date.setHours(date.getHours() - offset)
    return date
  }

  static convertToDate(value: number): Date {
    if (this.isEmptyObject(value)) {
      return undefined
    }
    return new Date(value * 1000)
  }
}
