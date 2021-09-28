/**
 * You-space services module
 */
const request = async (path, options) => {
  const baseUrl = '/api/v1'

  const headers = new Headers()
  headers.append('Content-Type', 'application/json')

  const url = `${baseUrl}/${path}`

  return fetch(url, {
    ...options,
    headers,
  })
    .then((r) => r.json())
    .catch((err) => {
      throw new Error(err)
    })
}

class Types {
  async create(name, schemaPath) {
    return await request('types', {
      method: 'POST',
      body: JSON.stringify({ name, schemaPath }),
    })
  }
}

export const types = new Types()
