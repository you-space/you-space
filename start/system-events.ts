import { Space } from 'App/Services/SpaceService'
import Application from '@ioc:Adonis/Core/Application'
import { requireAll, string } from '@ioc:Adonis/Core/Helpers'

const listeners = requireAll(Application.makePath('app', 'Listeners')) || {}

Object.values(listeners).forEach((listener) => {
  const methods = Object.getOwnPropertyNames(listener.prototype).filter((m) => m !== 'constructor')
  const instance = new listener()
  methods.forEach((method) => {
    const methodName = string.dashCase(instance.name || listener.name)

    const event = [methodName, string.dashCase(method)].join(':')

    Space.setHandler(event, instance[method].bind(instance))
  })
})
