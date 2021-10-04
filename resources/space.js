import 'https://cdn.socket.io/4.0.1/socket.io.min.js'
class Space {
  socket = io('/', {
    path: '/api/v1/sockets',
  })

  timeout = 5000

  setTimeout(value) {
    this.timeout = value
  }

  resetTimeout() {
    this.timeout = 5000
  }

  emit(event, ...args) {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error(`${event} event timeout`))
      }, this.timeout)

      this.socket.emit(event, ...args, (err, result) => {
        clearTimeout(timer)
        if (err) {
          return reject(err)
        }
        return resolve(result)
      })
    })
  }

  on(eventName, callback) {
    this.socket.on(eventName, callback)
  }

  nativeEmit(...args) {
    return this.socket.emit(...args)
  }

  nativeOn(...args) {
    return this.socket.on(...args)
  }
}

export default new Space()
