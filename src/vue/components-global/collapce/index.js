import './style.css'
import template from './template.html'

export default {
  template,
  props: {
    state: {
      type: Boolean,
      default: false
    }
  }
}
