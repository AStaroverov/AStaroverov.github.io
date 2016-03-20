import template from './template.html'

export default {
  template,
  data() {
    return {
      source
    }
  },
  components: {
    'vue-test': {
      template: '<div><slot></slot></div>',
    }
  }
}

const source = `
# Template

<span>$mq.resize {{ $mq.resize }}</span>
<vue-test v-show="$mq.resize && $mq.notHD()">
  vue-test v-show="$mq.resize && $mq.notHD()"
</vue-test>
<vue-test v-show="$mq.resize && $mq.expr('(min-width: 600px)')">
  vue-test v-show="$mq.resize && $mq.expr('(min-width: 600px)')"
</vue-test>
<vue-test v-show="$mq.resize && $mq.between([$mv.screenXs, 1920])">
  vue-test v-show="$mq.resize && $mq.between([$mv.screenXs, 1920])"
</vue-test>
<vue-test v-show="$mq.resize && $mq.beyond([$mv.screenXs, 1000])">
  vue-test v-show="$mq.resize && $mq.beyond([$mv.screenXs, 1000])"
</vue-test>
<vue-test v-show="$mq.resize && $mq.above($mv.screenXs)">
  vue-test v-show="$mq.resize && $mq.above($mv.screenXs)"
</vue-test>
<vue-test v-show="$mq.resize && $mq.below(1200)">
  vue-test v-show="$mq.resize && $mq.below(1200)"
</vue-test>

# Script

import Vue from ''

Vue.use(vMediaQuery, {
  methods: {
    notHD() {
      return window.innerWidth !== 1920
    },
    itHD() {
      return window.innerWidth === 1920
    },
  },
  variables: {
    screenXs: 600,
    screenHd: 1920
  }
});

Vue.component('vue-test', {
  template: '<div><slot></slot></div>',
})

`
