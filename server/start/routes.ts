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

import Route from '@ioc:Adonis/Core/Route'
import './admin.routes'

Route.get('/', async () => {
  return { hello: 'world' }
})

Route.group(() => {
  Route.post('/sign-up', 'AuthController.store')
  Route.post('/login', 'AuthController.login')
  Route.get('/who-i-am', 'AuthController.show')

  Route.get('videos', 'VideosController.index')
  Route.get('videos/trending', 'VideosController.trending')
  Route.get('videos/:id', 'VideosController.show')

  Route.get('videos/embed/:id', 'FilesController.embed').middleware('acl')
  Route.get('files/embed/:id', 'FilesController.showFile').middleware('acl')
}).prefix('v1')
