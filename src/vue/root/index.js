import './style.css'
import template from './template.html'

import 'vue-toast/dist/vue-toast.min.css'
import VueToast from 'vue-toast'

export default {
  replace: false,
  template,
  components: {
    VueToast
  }
}
