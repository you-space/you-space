import ItemsManager from './ItemsManager'
import ProviderManager from './ProviderManager'
import TypeManager from './TypeManager'

// inject a property or method of file in class
export function property() {
  return function (target: any, key: string) {
    Object.defineProperty(target, key, {
      get() {
        return this['$instance'][key]
      },
      set(newVal) {
        this['$instance'][key] = newVal
      },
      enumerable: true,
      configurable: true,
    })
  }
}

// Method Decorator
export function method() {
  return function (target: any, key: string) {
    target.constructor.$addMethod(key)
  }
}

// inject type manager
export function injectMethod() {
  return function (target: any, key: string, descriptor: PropertyDescriptor) {
    target.constructor.$addInject(key, descriptor.value)
  }
}

method.inject = injectMethod

// Hook Decorator
export function hook(event: string) {
  return function (target: any, _key: string, descriptor: PropertyDescriptor) {
    const handler = descriptor.value

    target.constructor.$addListener({
      event,
      handler,
    })
  }
}

// inject type manager
export function type(allowWrite?: boolean) {
  return function (target: any, key: string) {
    target.constructor.$addInject(key, new TypeManager(allowWrite))
  }
}

// inject provider manager
export function provider() {
  return function (target: any, key: string) {
    target.constructor.$addInject(key, new ProviderManager())
  }
}

// inject item manager
export function item(allowWrite?: boolean) {
  return function (target: any, key: string) {
    const value = new ItemsManager(allowWrite)

    target.constructor.$addInject(key, value)

    Object.defineProperty(target, key, {
      get() {
        return this['$instance'][key]
      },
      set(newVal) {
        this['$instance'][key] = newVal
      },
      enumerable: true,
      configurable: true,
    })
  }
}

// inject all managers
export function manager() {
  return function (target: any, key: string) {
    target.constructor.$addInject(key, async () => {
      const TypeManager = (await import('./TypeManager')).default
      return {
        type: new TypeManager(),
        provider: new ProviderManager(),
      }
    })
  }
}

manager.type = type
manager.provider = provider
manager.item = item
