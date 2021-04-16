import { Plugin, inject } from 'vue'
import { BootArgs } from '@/types'
import { createMachine } from './machine'

const machineSymbol = Symbol('you-space-machine')

export const machine = createMachine('http://localhost:3333')

const machinePlugin: Plugin = {
  install(app) {
    app.provide(machineSymbol, machine)
  },
}

export function useMachine() {
  const machine = inject<ReturnType<typeof createMachine>>(machineSymbol)

  if (!machine) {
    throw new Error('machine symbol not found')
  }

  return machine
}

export default function ({ app }: BootArgs) {
  app.use(machinePlugin)
}

export * from './machine'
