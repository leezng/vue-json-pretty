<template>
  <div>
    <div :style="{ display: 'inline-block', width: level * 1 + 'em' }" />
    <span
      v-if="currentKey"
      class="vjs-key"
    >
      {{ currentKey }}:
    </span>
    <template v-if="data === '[' || data === ']' || data === '{' || data === '}' ">
      <brackets-left
        v-if="data === '[' || data === '{'"
        :visible.sync="visible"
        :data="data"
        :collapsed-on-click-brackets="true"
        @click="onBracketsLeft"
      />
      <brackets-right
        v-else
        :visible.sync="visible"
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
      path: String,
      level: Number,
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

      onBracketsLeft (val) {
        this.$emit('brackets-click', 'left', val, this.path)
      },

      onBracketsRight (val) {
        this.$emit('brackets-click', 'right', val, this.path)
      }
    }
  }
</script>
