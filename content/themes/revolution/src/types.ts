import { App } from 'vue'

export interface BootArgs {
  app: App
}

export interface Boot {
  (args: BootArgs): void | Promise<void>
}
