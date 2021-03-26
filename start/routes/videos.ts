import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('videos', 'VideosController.index')
  Route.get('videos/trending', 'VideosController.trending')
  Route.get('videos/:id', 'VideosController.show')

  Route.get('comments/:videoId', 'CommentsController.showVideoComments')

  Route.get('videos/embed/:id', 'FilesController.embed')
  Route.get('files/embed/:id', 'FilesController.showFile')
})
  .prefix('v1')
  .prefix('api')
