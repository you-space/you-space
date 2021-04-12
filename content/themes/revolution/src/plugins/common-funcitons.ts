import { BootArgs } from '@/types'

export function getVideoTo(id: string) {
  return {
    name: 'video-single',
    params: {
      videoId: id,
    },
  }
}

export default function ({ app }: BootArgs) {
  app.config.globalProperties.$common = {
    getVideoTo,
  }
}
