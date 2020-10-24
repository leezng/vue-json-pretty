import pkg from '../package.json';
import App from './components/app.vue'
import './assets/less/index.less'

export default Object.assign({}, App, {
  version: pkg.version
})
