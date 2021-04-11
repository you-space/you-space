import { App } from 'vue'
import { Boot } from './types'

const context = require.context('./plugins', true, /\.ts$/)

const fileNames = context.keys().filter((filename) => {
  const [plugin, deepFile] = filename.replace('./', '').split('/')

  if (plugin.includes('.ts')) {
    return true
  }

  if (deepFile === 'index.ts') {
    return true
  }

  return false
})

const boots: Boot[] = []

fileNames.forEach((filename) => {
  const plugin = context(filename)
  boots.push(plugin.default)
})

async function bootPlugins(app: App) {
  return Promise.all(boots.map(async (boot) => await boot({ app })))
}

export default bootPlugins
