import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Permission from 'App/Models/Permission'
import { VideoFactory } from 'Database/factories'

export default class VideoSeederSeeder extends BaseSeeder {
  public static developmentOnly = true
  public async run() {
    const { id: publicId } = await Permission.findByOrFail('name', 'visibility:public')
    const { id: privateId } = await Permission.findByOrFail('name', 'visibility:private')

    const factory = VideoFactory.with('images', 1, (fac) => fac.merge({ name: 'default' }))
      .with('views', 3)
      .with('comments', 5)

    await factory.createMany(50, (model) => model.merge({ permissionId: publicId }))

    await factory.createMany(50, (model) => model.merge({ permissionId: privateId }))
  }
}
