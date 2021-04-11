import { App } from 'vue'
import { Boot } from './types'

const context = require.context('./plugins', true, /index.ts$/)
const fileNames = context.keys()

const boots: Boot[] = []

fileNames.forEach((filename) => {
  const plugin = context(filename)
  boots.push(plugin.default)
})

async function bootPlugins(app: App) {
  return Promise.all(boots.map(async (boot) => await boot({ app })))
}

export default bootPlugins
