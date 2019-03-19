<template>
  <div>
    <slot></slot>

    <!-- Expand -->
    <span
      v-show="dataVisiable"
      class="vjs-tree__brackets"
      @click.stop="toggleBrackets">
      {{ Array.isArray(data) ? '[' : '{' }}
    </span>

    <!-- Collapse -->
    <span
      v-show="!dataVisiable"
      class="vjs-tree__brackets"
      @click.stop="toggleBrackets">
      {{ doubleBracketsGenerator(data) }}
    </span>
  </div>
</template>

<script>
  import bracketsMixin from 'src/mixins/brackets-mixin'

  export default {
    mixins: [bracketsMixin],
    props: {
      showLength: Boolean
    },
    methods: {
      // 双括号内容生成器
      doubleBracketsGenerator (data) {
        const isArray = Array.isArray(data)
        const brackets = isArray ? '[...]' : '{...}'
        let str = this.bracketsFormatter(brackets)
        if (this.showLength) {
          // 若展示长度, 形如 [...] // 3 items
          const text = isArray
            ? `${data.length} items`
            : `${Object.keys(data).length} keys`
          str += ` // ${text}`
        }
        return str
      }
    }
  }
</script>
