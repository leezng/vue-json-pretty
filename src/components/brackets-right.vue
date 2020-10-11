<template>
  <span
    v-show="visible"
    class="vjs-tree__brackets"
    @click.stop="toggleBrackets"
  >
    {{ bracketsFormatter(data) }}
  </span>
</template>

<script>
  import bracketsMixin from 'src/mixins/brackets-mixin'

  export default {
    mixins: [bracketsMixin]
  }
</script>
