import axios from 'axios'

const api = axios.create()

export interface Video {
  title: string
  src: string
}

export interface FetchVideosFilter {
  page?: number
  visibility?: string
}
export interface FetchVideosResponse {
  data: Video[]
  meta: {
    last_page: number
    total: number
  }
}

async function fetchVideos(filters?: FetchVideosFilter): Promise<FetchVideosResponse> {
  const { data } = await api.get('api/v1/videos', {
    params: filters,
  })
  return data
}

async function findVideo(id: string) {
  const { data } = await api.get<Video>(`api/v1/videos/${id}`)
  return data
}

async function fetchVideoComments(id: string) {
  const { data } = await api.get(`api/v1/videos/${id}/comments`)
  return data
}

export function createMachine(baseURL = '/') {
  api.defaults.baseURL = baseURL
  return {
    fetchVideos,
    findVideo,
    fetchVideoComments,
  }
}

export default createMachine
