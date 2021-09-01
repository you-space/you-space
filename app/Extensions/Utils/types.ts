export type This<T extends new (...args: any) => any> = {
  new (...args: ConstructorParameters<T>): any
} & Pick<T, keyof T>

export interface HookListener {
  event: string
  handler: (data: any) => Promise<void>
}