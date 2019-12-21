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
  computed: {
    dataVisible: {
      get () {
        return this.visible
      },
      set (val) {
        if (this.collapsedOnClickBrackets) {
          this.$emit('update:visible', val)
        }
      }
    }
  },
  methods: {
    // 切换括号展开|关闭
    toggleBrackets () {
      this.dataVisible = !this.dataVisible
    },
    // 括号优化函数, 若不是最后一项, 自动添加逗号
    bracketsFormatter (brackets) {
      return this.showComma ? `${brackets},` : brackets
    }
  }
}
