export default {
  data () {
    return {
      show: true
    }
  },
  computed: {
    lastIndex () {
      if (this.isArray(this.data)) {
        return this.data.length - 1
      } else if (this.isObject(this.data)) {
        let arr = Object.keys(this.data)
        return arr[arr.length - 1]
      }
    }
  },
  methods: {
    getType (value) {
      return Object.prototype.toString.call(value).slice(8, -1).toLowerCase()
    },
    isObject (value) {
      return this.getType(value) === 'object'
    },
    isArray (value) {
      return Array.isArray(value)
    },
    toggle () {
      this.show = !this.show
    }
  }
}
