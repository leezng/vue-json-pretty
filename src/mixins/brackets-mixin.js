export default {
  props: {
    visible: {
      required: true,
      type: Boolean
    },
    data: {
      required: true
    },
    notLastKey: Boolean
  },
  computed: {
    dataVisiable: {
      get () {
        return this.visible
      },
      set (val) {
        this.$emit('update:visible', val)
      }
    }
  },
  methods: {
    // 切换括号展开|关闭
    toggleBrackets () {
      this.dataVisiable = !this.dataVisiable
    },
    // 括号优化函数, 若不是最后一项, 自动添加逗号
    bracketsFormatter (brackets) {
      return this.notLastKey ? `${brackets},` : brackets
    }
  }
}
