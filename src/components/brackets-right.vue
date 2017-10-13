<template>
  <div v-show="dataVisiable">
    <span
      :class="{
        'vjs__tree__node': true,
        'vjs__not__lastIndex': index !== lastIndex }"
      @click.stop="dataVisiable = !dataVisiable">{{ Array.isArray(data) ? ']' : '}' }}</span>
  </div>
</template>

<script>
  import bracketsMixin from 'src/mixins/brackets-mixin'

  export default {
    mixins: [bracketsMixin]
  }
</script>
