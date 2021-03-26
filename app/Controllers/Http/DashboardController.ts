import View from '@ioc:Adonis/Core/View'
export default class DashboardController {
  public login() {
    return View.render('login')
  }
}
