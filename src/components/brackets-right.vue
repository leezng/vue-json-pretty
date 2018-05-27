<template>
  <div v-show="dataVisiable">
    <span
      class="vjs__tree__node"
      @click.stop="dataVisiable = !dataVisiable">
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
