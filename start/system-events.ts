import path from 'path'
import fs from 'fs'
import Space from 'App/Services/Space'

import { requireIfExist } from 'App/Helpers'

const files = fs.readdirSync(path.resolve(__dirname, 'events'))

files
  .filter((f) => !/.*test\.ts/.test(f))
  .forEach((file) => {
    let event = requireIfExist(path.resolve(__dirname, 'events', file))

    if (event) {
      event = event.default
      Space.registerHandler({
        name: file.replace('.ts', ''),
        roles: ['admin'],
        ...event,
      })
    }
  })

global.space = {
  on: Space.on.bind(Space),
  emit: Space.emit.bind(Space),
}
