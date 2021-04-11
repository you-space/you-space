import { Quasar } from 'quasar'
import { BootArgs } from '@/types'
import options from './options'

export default function ({ app }: BootArgs) {
  app.use(Quasar, options)
}
