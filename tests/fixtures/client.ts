import supertest from 'supertest'
import User from 'App/Models/User'

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

let cookies: string | undefined

export function createClient() {
  const client = {
    ...supertest(BASE_URL),
    isAuthenticated: () => !!cookies,
    login: async () => Promise.resolve(),
    logout: async () => Promise.resolve(),
  }

  const methods = ['get', 'post', 'patch', 'put', 'delete']

  methods.forEach((method) => {
    client[method] = (path: string) => {
      const request = supertest(BASE_URL)[method](path)

      if (cookies) {
        request.set('cookie', cookies)
      }

      return request
    }
  })

  client.logout = async () => {
    if (cookies) {
      await client.delete('/auth/logout').expect(200)
    }

    cookies = undefined
  }

  client.login = async () => {
    const user = await User.updateOrCreate(
      { username: 'admin' },
      {
        username: 'admin',
        password: 'ys-123',
      }
    )

    await user.addRoleByName('admin')

    const { headers } = await client
      .post('/api/v1/auth/login')
      .send({
        uuid: 'admin',
        password: 'ys-123',
      })
      .expect(200)

    cookies = headers['set-cookie']
  }

  return client
}
