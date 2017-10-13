<template>
  <div>
    <slot></slot>
    <span
      v-show="dataVisiable"
      class="vjs__tree__node"
      @click.stop="dataVisiable = !dataVisiable">
      {{ Array.isArray(data) ? '[' : '{' }}
    </span>
    <span
      v-show="!dataVisiable"
      :class="{
        'vjs__tree__node': true,
        'vjs__not__lastIndex': index !== lastIndex
      }"
      @click.stop="dataVisiable = !dataVisiable">{{ Array.isArray(data) ? '[...]' : '{...}' }}</span>
  </div>
</template>

<script>
  import bracketsMixin from 'src/mixins/brackets-mixin'

  export default {
    mixins: [bracketsMixin]
  }
</script>
