import template from './template.html'

export default {
  template,
  data() {
    return {
      maxToasts: 6,
      position: 'bottom right',
      theme: 'error',
      timeLife: 3000,
      closeBtn: false,
      source,
    }
  },
  watch: {
    'delayOfJumps + maxToasts + position': 'resetOptions'
  },
  attached() {
    this.resetOptions()
  },
  methods: {
    resetOptions() {
      this.$root.$refs.toast.setOptions({
        delayOfJumps: this.delayOfJumps,
        maxToasts: this.maxToasts,
        position: this.position
      })
    },
    showTime() {
      this.$root.$refs.toast.showToast(new Date, {
        theme: this.theme,
        timeLife: this.timeLife,
        closeBtn: this.closeBtn
      })
    }
  },
}


const source = `
# Root component

## Template
...
<vue-toast v-ref:toast></vue-toast>
...

## Vue instance
import vueToast from 'vue-toast'

export defailt {
  ...
  components: {
    'vue-toast': vueToast
  }
  ...
}


# This component
## Template
<p>Options of component.</p>
<label>
  <input type="text" v-model="maxToasts">
  maxToasts
</label>
<br>
<label>
  <input type="text" v-model="position">
  position
</label>

<hr>
<p>Options of toast.</p>

<label>
  <input type="text" v-model="theme">
  theme
</label>
<br>
<label>
  <input type="text" v-model="timeLife" :disabled="closeBtn">
  timeLife
</label>
<br>
<label>
  <input type="checkbox" v-model="closeBtn">
  closeBtn
</label>
<hr>

<div class="mdl-button mdl-button--accent" @click="showTime">Show time</div>

## Vue instance
export defailt {
  data() {
    return {
      maxToasts: 6,
      position: 'bottom right',
      theme: 'error',
      timeLife: 3000,
      closeBtn: false
    }
  },
  watch: {
    'delayOfJumps + maxToasts + position': 'resetOptions'
  },
  attached() {
    this.resetOptions()
  },
  methods: {
    resetOptions() {
      this.$root.$refs.toast.setOptions({
        delayOfJumps: this.delayOfJumps,
        maxToasts: this.maxToasts,
        position: this.position
      })
    },
    showTime() {
      this.$root.$refs.toast.showToast(new Date, {
        theme: this.theme,
        timeLife: this.timeLife,
        closeBtn: this.closeBtn
      })
    }
  },
}
`
