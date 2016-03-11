import template from './template.html'

export default {
  template,
  components: {
    'vue-test': {
      template: '<div><slot></slot> {{ $mq.resize }} text</div>',
    }
  }
}
