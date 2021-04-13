import { BootArgs } from '@/types'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

export default function ({ app }: BootArgs) {
  library.add(fas, far, fab)
  app.component('FIcon', FontAwesomeIcon)
}
