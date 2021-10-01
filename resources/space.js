import 'https://cdn.socket.io/4.0.1/socket.io.min.js'

class Space {
  socket = io('/', {
    path: '/api/v1/sockets',
  })

  emit(eventName, args) {
    return new Promise((resolve) => {
      this.socket.emit(eventName, args, resolve)
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
