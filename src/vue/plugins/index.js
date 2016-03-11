import Vue from 'vue'
import vueRouter from 'vue-router'
import vMediaQuery from 'v-media-query'

Vue.use(vueRouter)
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
