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
    bracketsFormatter (brackets) {
      return this.notLastKey ? `${brackets},` : brackets
    }
  }
}
