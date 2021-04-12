import { BootArgs } from '@/types'
import { createI18n } from 'vue-i18n'
import EnUs from './en-US'

export const i18n = createI18n({
  messages: {
    'en-US': EnUs,
  },
})

export default function ({ app }: BootArgs) {
  app.use(i18n)
}
