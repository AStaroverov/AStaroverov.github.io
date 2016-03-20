import VueRouter from 'vue-router';
import mainPage from '../components/main-page'
import openSource from '../components/open-source-page'

let router = new VueRouter()

router.map({
  '/': {
    name: 'main',
    component: mainPage,
  },
  '/open-source': {
    name: 'openSource',
    component: openSource,
  },
  '/open-source/vue-toast': {
    component(resolve) {
      require(['../components/vue-toast'], resolve)
    },
  },
  '/open-source/vue-media-query': {
    component(resolve) {
      require(['../components/vue-media-query'], resolve)
    },
  },
  '/open-source/vue-dynamic-component': {
    component(resolve) {
      require(['../components/vue-dynamic-component'], resolve)
    },
  },
})

router.redirect({
  '/example/:example': '/open-source/:example',
})

export default function(app, selector) {
  router.start(app, selector)
}
