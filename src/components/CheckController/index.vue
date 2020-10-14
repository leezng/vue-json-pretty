<template>
  <!-- click.stop 避免向上冒泡触发 tree.vue 的 click 事件-->
  <label
    :class="[ `vjs-${uiType}`, checked ? 'is-checked': '' ]"
    @click.stop
  >
    <span :class="`vjs-${uiType}__inner`" />
    <input
      v-model="model"
      :class="`vjs-${uiType}__original`"
      :type="uiType"
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
      checked: {
        type: Boolean,
        default: false
      },
      isMultiple: Boolean
    },
    data () {
      return {
        focus: false
      }
    },
    computed: {
      uiType () {
        return this.isMultiple ? 'checkbox' : 'radio'
      },

      model: {
        get () {
          return this.checked
        },
        set (val) {
          this.$emit('input', val)
        }
      }
    }
  }
</script>
