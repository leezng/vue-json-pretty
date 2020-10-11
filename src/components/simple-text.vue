<template>
  <div>
    <div :style="{ flex: `0 0 ${level * 1}em` }" />
    <span
      v-if="currentKey"
      class="vjs-key"
    >
      {{ prettyKey }}:
    </span>
    <span>
      <template v-if="data === '[' || data === ']' || data === '{' || data === '}' ">
        <brackets-left
          v-if="data === '[' || data === '{'"
          :visible="visible"
          :data="data"
          :collapsed-on-click-brackets="true"
          @click="onBracketsLeft"
        />
        <brackets-right
          v-else
          :visible="visible"
          :data="data"
          :collapsed-on-click-brackets="true"
          @click="onBracketsRight"
        />
      </template>
      <template v-else>
        <span
          v-if="customValueFormatter"
          :class="valueClass"
          v-html="customFormatter(data)"
        />
        <span
          v-else
          :class="valueClass"
        >{{ defaultFormatter(data) }}</span>
      </template>
      <span v-if="showComma">,</span>
    </span>
  </div>
</template>

<script>
  import BracketsLeft from './brackets-left'
  import BracketsRight from './brackets-right'
  import { getDataType } from 'src/utils'

  export default {
    components: {
      BracketsLeft,
      BracketsRight
    },
    props: {
      defaultVisible: Boolean,
      path: {
        type: String,
        default: ''
      },
      level: {
        type: Number,
        default: 0,
      },
      showDoubleQuotes: Boolean,
      parentData: {
        type: [String, Number, Boolean, Array, Object],
        default: null
      },
      data: {
        type: [String, Number, Boolean],
        default: ''
      },
      showComma: Boolean,
      currentKey: {
        type: [Number, String],
        default: ''
      },
      customValueFormatter: {
        type: Function,
        default: null
      },
    },
    data () {
      return {
        visible: this.defaultVisible
      }
    },
    computed: {
      valueClass () {
        return `vjs-value vjs-value__${this.dataType}`
      },

      // 当前数据类型
      dataType () {
        return getDataType(this.data)
      },

      prettyKey () {
        return this.showDoubleQuotes ? `"${this.currentKey}"` : this.currentKey
      },
    },
    watch: {
      defaultVisible (newVal) {
        this.visible = newVal
      }
    },
    methods: {
      defaultFormatter (data) {
        let text = data + ''
        if (this.dataType === 'string') text = `"${text}"`
        return text
      },

      customFormatter (data) {
        return this.customValueFormatter
          ? this.customValueFormatter(data, this.currentKey, this.parentData, this.defaultFormatter(data))
          : this.defaultFormatter(data)
      },

      onBracketsLeft () {
        this.$emit('brackets-click', 'left', !this.visible, this.path)
      },

      onBracketsRight () {
        this.$emit('brackets-click', 'right', !this.visible, this.path)
      }
    }
  }
</script>
