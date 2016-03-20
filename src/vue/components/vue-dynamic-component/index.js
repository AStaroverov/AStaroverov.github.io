import template from './template.html'

import Vue from 'vue'
import {install} from 'vue-dynamic-component'

Vue.use(install)

export default {
  template,
  data() {
    return {
      index: 0,
      comp,
      source
    }
  },
}

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

let source = `
# Template

<div>
  <vue-dynamic-component v-for="n in 4" :component="comp[n]">
    <div>component with inlineTemplate {{msg}} <button @click="msg += '!'">add !</button></div>
  </vue-dynamic-component>
</div>
<hr>
<div>
  <button @click="index += 1">+1</button>
  <button @click="index -= 1">-1</button>
  <span>component index = {{index}}</span> <br>
  <vue-dynamic-component  :component="comp[index]">
    <div>component with inlineTemplate {{msg}} <button @click="msg += '!'">add !</button></div>
  </vue-dynamic-component>
</div>

# Script

## Init component

import {install1} from 'vue-dynamic-component'
Vue.use(install)


## Vue instance

export default {
  template,
  data() {
    return {
      index: 0,
      comp: comp
    }
  },
}

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

`
