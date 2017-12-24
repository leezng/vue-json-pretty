export default {
  props: {
    visiable: {
      required: true,
      type: Boolean
    },
    data: {
      required: true
    },
    index: [Number, String],
    lastIndex: [Number, String]
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
  }
}
