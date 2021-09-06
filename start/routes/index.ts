import { listDirectoryFiles } from '@adonisjs/core/build/standalone'
import Application from '@ioc:Adonis/Core/Application'

const files = listDirectoryFiles(__dirname, Application.appRoot, [
  './start/routes/index',
  './start/routes/client',
])

files.forEach((file) => {
  require(Application.makePath(file))
})

// need to be in the last import
import './client'
