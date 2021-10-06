import Space from 'App/Services/Space'
import Application from '@ioc:Adonis/Core/Application'
import { requireAll, string } from '@ioc:Adonis/Core/Helpers'

const listeners = requireAll(Application.makePath('app', 'Listeners')) || {}

Object.values(listeners).forEach((listener) => {
  const methods = Object.getOwnPropertyNames(listener.prototype).filter((m) => m !== 'constructor')
  const instance = new listener()
  methods.forEach((method) => {
    Space.setHandler(
      [string.dashCase(listener.name), string.dashCase(method)].join(':'),
      instance[method]
    )
  })
})
