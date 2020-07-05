<template>
  <div>
    <slot />
    <span
      v-if="customValueFormatter"
      :class="valueClass"
      v-html="customFormatter(data)"
    />
    <span
      v-else
      :class="valueClass"
    >
      {{ defaultFormatter(data) }}
    </span>
  </div>
</template>

<script>
  import { getDataType } from 'src/utils'

  export default {
    props: {
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
        if (this.showComma) text += ','
        return text
      },

      customFormatter (data) {
        return this.customValueFormatter
          ? this.customValueFormatter(data, this.currentKey, this.parentData, this.defaultFormatter(data))
          : this.defaultFormatter(data)
      }
    }
  }
</script>
