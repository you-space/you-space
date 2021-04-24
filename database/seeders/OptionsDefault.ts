import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import YsOption, { BaseOptions } from 'App/Models/YsOption'

export default class OptionsDefaultSeeder extends BaseSeeder {
  public async run() {
    await YsOption.fetchOrCreateMany('name', [
      {
        name: BaseOptions.ActivatedPlugins,
        value: [],
      },
      {
        name: BaseOptions.ContentProviders,
        value: [],
      },
    ])
  }
}
