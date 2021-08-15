import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.resource('types.items', 'TypeItemsController').only(['index']).middleware({
    //   store: ['auth:api', 'acl:admin'],
    // update: ['auth:api', 'acl:admin'],
    // destroy: ['auth:api', 'acl:admin'],
  })

  Route.resource('item-types.fields', 'ItemTypesFieldsController').apiOnly().only(['index'])
})
  .prefix('v1')
  .prefix('api')
