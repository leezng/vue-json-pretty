<template>
  <!-- click.stop 避免向上冒泡触发 tree.vue 的 click 事件-->
  <label :class="[ 'vjs-checkbox', value ? 'is-checked': '' ]" @click.stop>
    <span :class="[ 'vjs-checkbox__input', value ? 'is-checked': '' ]">
      <span class="vjs-checkbox__inner"></span>
      <input
        class="vjs-checkbox__original"
        type="checkbox"
        :name="name"
        v-model="model"
        @change="$emit('change', model)"
        @focus="focus = true"
        @blur="focus = false">
    </span>
  </label>
</template>

<script>
  export default {
    props: {
      name: String,
      value: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        focus: false,
        checked: false
      }
    },
    computed: {
      model: {
        get () {
          return this.value !== undefined ? this.value : this.checked
        },
        set (val) {
          this.checked = val
          this.$emit('input', val)
        }
      }
    }
  }
</script>
