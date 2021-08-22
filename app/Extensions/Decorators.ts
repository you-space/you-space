export interface PropertyOptions {
  type: 'normal' | 'ext-variable' | 'ext-method'
  name: string
}

export function extProperty(type: PropertyOptions['type'] = 'normal') {
  return function (target: any, key: string) {
    target.constructor.$addProperty({
      name: key,
      type: type,
    })
  }
}

export function extMethod() {
  return function (target: any, key: string) {
    target.constructor.$addMethod(key)
  }
}

// Property Decorator
export function extHook(event: string) {
  return function (target: any, key: string, descriptor: PropertyDescriptor) {
    const handler = descriptor.value

    target.constructor.$addObserver({
      event,
      handler,
    })
  }
}
