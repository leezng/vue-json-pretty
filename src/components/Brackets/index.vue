<template>
  <span
    class="vjs-tree__brackets"
    @click.stop="toggleBrackets"
  >
    {{ data }}
  </span>
</template>

<script>
  import './styles.less'
  
  export default {
    props: {
      data: {
        required: true,
        type: String
      },
      collapsedOnClickBrackets: Boolean
    },
    methods: {
      // 切换括号展开|关闭
      toggleBrackets (e) {
        if (this.collapsedOnClickBrackets) {
          this.$emit('click', e)
        }
      },
    }
  }
</script>
