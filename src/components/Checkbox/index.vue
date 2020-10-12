<template>
  <!-- click.stop 避免向上冒泡触发 tree.vue 的 click 事件-->
  <label
    :class="[ 'vjs-checkbox', value ? 'is-checked': '' ]"
    @click.stop
  >
    <span class="vjs-checkbox__inner" />
    <input
      v-model="model"
      class="vjs-checkbox__original"
      type="checkbox"
      @change="$emit('change', model)"
      @focus="focus = true"
      @blur="focus = false"
    >
  </label>
</template>

<script>
  import './styles.less';
  
  export default {
    props: {
      value: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        focus: false
      }
    },
    computed: {
      model: {
        get () {
          return this.value
        },
        set (val) {
          this.$emit('input', val)
        }
      }
    }
  }
</script>
