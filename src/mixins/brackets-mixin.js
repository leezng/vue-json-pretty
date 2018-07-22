export default {
  props: {
    visiable: {
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
        return this.visiable
      },
      set (val) {
        this.$emit('update:visiable', val)
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
