<template>
  <div v-show="dataVisiable" style="display: inline-block;">
    <span
      class="vjs-tree__brackets"
      @click.stop="toggleBrackets"
    >
      {{ bracketsFormatter(data) }}
    </span>
  </div>
</template>

<script>
  import bracketsMixin from 'src/mixins/brackets-mixin'

  export default {
    mixins: [bracketsMixin]
  }
</script>
