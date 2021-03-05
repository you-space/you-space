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

Route.group(() => {
  Route.get('/', async () => {
    return { hello: 'world' }
  })

  Route.group(() => {
    Route.resource('videos', 'AdminVideosController').apiOnly()
  }).prefix('admin')

  Route.get('videos/trending', 'VideosController.getTrendingVideos')
  Route.get('videos/recommendations', 'VideosController.userRecommendations')
  Route.get('videos/subscriptions', 'VideosController.userSubscriptions')
  Route.get('videos/:id', 'VideosController.show')
  Route.get('thumbnails/:videoId', 'VideosController.showThumbnail')
}).prefix('v1')
