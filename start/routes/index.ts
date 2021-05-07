/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes/index.ts` as follows
|
| import './cart'
| import './customer'
|
*/

import { listDirectoryFiles } from '@adonisjs/core/build/standalone'
import Application from '@ioc:Adonis/Core/Application'

const files = listDirectoryFiles(__dirname, Application.appRoot, [
  './start/routes/index.ts',
  './start/routes/client.ts',
])

files.forEach((file) => {
  require(Application.makePath(file))
})

// need to be in the last import
import './client'
