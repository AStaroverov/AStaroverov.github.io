import './style.css'
import template from './template.html'

import VueNavigation from '../components/navigation'
import VueToast from 'vue-toast'
import 'vue-toast/dist/vue-toast.min.css'

export default {
  template,
  components: {
    VueNavigation,
    VueToast,
  }
}
