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
        name: file,
        roles: event.roles || ['admin'],
        ...event,
      })
    }
  })

global.space = Space
