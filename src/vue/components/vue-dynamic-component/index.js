import template from './template.html'

import Vue from 'vue'
import * as vueDynamicComponent from 'vue-dynamic-component'

Vue.use(vueDynamicComponent)

let comp = [
  {
    template: '<div>default component with {{msg}} <button @click="msg += \'!\'">add !</button></div>',
    data() {
      return {msg: 'nothing'}
    },
  },
  {
    keepAliveId: 'id123',
    template: '<div>component with {{msg}} <button @click="msg += \'!\'">add !</button></div>',
    data() {
      return {msg: 'keepAliveId'}
    },
  },
  {
    inlineTemplate: true,
    data() {
      return {msg: ''}
    },
  },
  {
    keepAliveId: 'id124',
    inlineTemplate: true,
    data() {
      return {msg: 'and keepAliveId'}
    },
  },
]

export default {
  template,
  data() {
    return {
      index: 0,
      comp: comp
    }
  },
}
