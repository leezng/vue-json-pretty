import pkg from '../package.json';
import Tree from './components/Tree'

export default Object.assign({}, Tree, {
  version: pkg.version
})
