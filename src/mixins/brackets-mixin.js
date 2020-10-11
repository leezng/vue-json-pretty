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
    collapsedOnClickBrackets: Boolean
  },
  methods: {
    // 切换括号展开|关闭
    toggleBrackets (e) {
      if (this.collapsedOnClickBrackets) {
        this.$emit('click', e)
      }
    },
    
    // 括号优化函数, 若不是最后一项, 自动添加逗号
    bracketsFormatter (brackets) {
      return this.showComma ? `${brackets},` : brackets
    }
  }
}
