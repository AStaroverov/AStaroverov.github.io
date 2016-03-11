import template from './template.html'

export default {
  template,
  data() {
    return {
      projects: [
        {
          title: 'Vue Toast',
          description: 'Toasts for vuejs',
          links: {
            github: 'https://github.com/AStaroverov/vue-toast',
            example: 'vue-toast'
          }
        },
        {
          title: 'Vue media query',
          description: 'Easy media query for vue',
          links: {
            github: 'https://github.com/AStaroverov/v-media-query',
            example: 'vue-media-query'
          }
        },
        {
          title: 'Vue dynamic component',
          description: 'Component for fast creating dynamical components.',
          links: {
            github: 'https://github.com/AStaroverov/vue-dynamic-component',
            example: 'vue-dynamic-component'
          }
        },
      ]
    }
  },
}
