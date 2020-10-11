<template>
  <span>
    <span
      v-show="visible"
      class="vjs-tree__brackets"
      @click.stop="toggleBrackets"
    >
      {{ data }}
    </span>

    <!-- Collapse -->
    <span v-show="!visible">
      <span
        class="vjs-tree__brackets"
        @click.stop="toggleBrackets"
      >
        {{ closedBracketsGenerator(data) }}
      </span>

      <span
        v-if="showLength"
        class="vjs-comment"
      >
        {{ lengthGenerator(data) }}
      </span>
    </span>
  </span>
</template>

<script>
  import bracketsMixin from 'src/mixins/brackets-mixin'

  export default {
    mixins: [bracketsMixin],
    props: {
      showLength: Boolean
    },
    methods: {
      // 关闭括号生成器
      closedBracketsGenerator (data) {
        const brackets = data === '[' ? '[...]' : '{...}'
        return this.bracketsFormatter(brackets)
      },

      // 长度标记生成器
      lengthGenerator (data) {
        // 若展示长度, 形如 [...] // 3 items
        const text = Array.isArray(data)
          ? `${data.length} items`
          : `${Object.keys(data).length} keys`
        return ` // ${text}`
      }
    }
  }
</script>
