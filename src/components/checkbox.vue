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

<style lang="less">
  .vjs-checkbox {
    color: #1f2d3d;
    user-select: none;
    .vjs-checkbox__input {
      outline: 0;
      line-height: 1;
      vertical-align: middle;
      cursor: pointer;
      display: inline-block;
      position: relative;
      white-space: nowrap;
      &.is-checked .vjs-checkbox__inner {
        background-color: #20a0ff;
        border-color: #0190fe;
        &:after {
          transform: rotate(45deg) scaleY(1);
        }
      }
    }
    .vjs-checkbox__inner {
      display: inline-block;
      position: relative;
      border: 1px solid #bfcbd9;
      border-radius: 4px;
      box-sizing: border-box;
      width: 18px;
      height: 18px;
      background-color: #fff;
      z-index: 1;
      transition: border-color .25s cubic-bezier(.71,-.46,.29,1.46),background-color .25s cubic-bezier(.71,-.46,.29,1.46);
      &:after {
        box-sizing: content-box;
        content: "";
        border: 2px solid #fff;
        border-left: 0;
        border-top: 0;
        height: 8px;
        left: 5px;
        position: absolute;
        top: 1px;
        transform: rotate(45deg) scaleY(0);
        width: 4px;
        transition: transform .15s cubic-bezier(.71,-.46,.88,.6) .05s;
        transform-origin: center;
      }
    }
    .vjs-checkbox__original {
      opacity: 0;
      outline: 0;
      position: absolute;
      margin: 0;
      width: 0;
      height: 0;
      left: -999px;
    }
  }
</style>
