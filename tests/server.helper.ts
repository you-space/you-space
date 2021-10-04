import getPort from 'get-port'
import { resolve } from 'path'

export async function startHttpServer() {
  const { Ignitor } = await import('@adonisjs/core/build/src/Ignitor')
  process.env.PORT = String(await getPort())
  await new Ignitor(resolve(__dirname, '..')).httpServer().start()
}
