<template>
  <div v-show="dataVisible">
    <span
      class="vjs-tree__brackets"
      @click.stop="toggleBrackets">
      {{ bracketsFormatter(Array.isArray(data) ? ']' : '}') }}
    </span>
  </div>
</template>

<script>
  import bracketsMixin from 'src/mixins/brackets-mixin'

  export default {
    mixins: [bracketsMixin]
  }
</script>
