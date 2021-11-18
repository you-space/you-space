import Route from '@ioc:Adonis/Core/Route'
import { createDashboard } from '@you-space/dashboard'

const dashboard = createDashboard('ys-admin')

Route.get('ys-admin', dashboard.render)
Route.get('ys-admin/*', dashboard.render)
