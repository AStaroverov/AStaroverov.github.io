import template from './template.html'

export default {
  template,
  data() {
    return {
      maxToasts: 6,
      position: 'bottom right',
      theme: 'error',
      timeLife: 3000,
      closeBtn: true,
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
