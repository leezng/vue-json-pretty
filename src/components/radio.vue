<template>
  <!-- click.stop 避免向上冒泡触发 tree.vue 的 click 事件-->
  <label
    :class="[ 'vjs-radio', model === currentPath ? 'is-checked': '' ]"
    @click.stop
  >
    <span class="vjs-radio__inner" />
    <input
      v-model="model"
      class="vjs-radio__original"
      type="radio"
      :value="currentPath"
      @change="change"
      @focus="focus = true"
      @blur="focus = false"
    >
  </label>
</template>

<script>
  export default {
    props: {
      path: {
        type: String,
        default: ''
      },
      value: {
        type: String,
        default: ''
      }
    },
    data () {
      return {
        focus: false
      }
    },
    computed: {
      currentPath () {
        return this.path
      },

      model: {
        get () {
          return this.value
        },
        set (val) {
          this.$emit('input', val)
        }
      }
    },
    methods: {
      change () {
        this.$emit('change', this.model)
      }
    }
  }
</script>
