export default {
  props: {
    visible: {
      required: true,
      type: Boolean
    },
    data: {
      required: true
    },
    showComma: Boolean,
    collapseBrackets: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    dataVisible: {
      get () {
        return this.visible
      },
      set (val) {
        this.$emit('update:visible', val)
      }
    },
    dataCollapseBracket: {
      get () {
        return this.collapseBrackets
      },
      set (val) {
        this.$emit('update:collapseBrackets', val)
      }
    }
  },
  methods: {
    // 切换括号展开|关闭
    toggleBrackets () {
      if (this.collapseBrackets) {
        this.dataVisible = !this.dataVisible
      }
    },
    toggleBracketsCollapse () {
      this.dataCollapseBracket = !this.dataCollapseBracket
    },
    // 括号优化函数, 若不是最后一项, 自动添加逗号
    bracketsFormatter (brackets) {
      return this.showComma ? `${brackets},` : brackets
    }
  }
}
