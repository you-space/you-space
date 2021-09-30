import path from 'path'
import Space from 'App/Services/Space'

import { requireAll } from '@ioc:Adonis/Core/Helpers'

const events = requireAll(path.resolve(__dirname, 'events'))

if (events) {
  Object.entries(events).forEach(([name, handler]) => {
    Space.registerHandler({
      name,
      roles: handler.roles || ['admin'],
      ...handler,
    })
  })
}

global.space = Space
