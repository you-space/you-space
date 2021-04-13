import { BootArgs } from '@/types'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

export default function ({ app }: BootArgs) {
  library.add(fas)
  app.component('FIcon', FontAwesomeIcon)
}
