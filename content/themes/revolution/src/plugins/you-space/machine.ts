import axios from 'axios'

const api = axios.create()

async function fetchVideos() {
  const { data } = await api.get('api/v1/videos')
  return data
}

export function createMachine(baseURL = '/') {
  api.defaults.baseURL = baseURL
  return {
    fetchVideos,
  }
}

export default createMachine
