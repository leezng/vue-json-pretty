<template>
  <div id="app">
    <tree :data="data"></tree>
  </div>
</template>

<script>
import Tree from 'src/components/tree'

export default {
  name: 'app',
  components: {
    Tree
  },
  data () {
    return {
      data: {
        a: 1,
        b: [{
          a: 1,
          b: 2
        }]
      }
    }
  }
}
</script>
