// Plugins
import './plugins'

// Filters
import './filters'

// Global components
import './components-global'

// Router init  function
import initRouter from './router'

// Root app
import app from './root'

initRouter(app, '#app')
