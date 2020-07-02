<template>
  <div>
    <slot></slot>
    <span v-if="customValueFormatter" :class="valueClass" v-html="customFormatter(data)"/>
    <span v-else :class="valueClass">{{ defaultFormatter(data) }}</span>
  </div>
</template>

<script>
  import { getDataType } from 'src/utils'

  export default {
    props: {
      showDoubleQuotes: Boolean,
      parentData: {},
      data: {},
      showComma: Boolean,
      currentKey: [Number, String],
      customValueFormatter: Function
    },
    computed: {
      valueClass () {
        return `vjs-value vjs-value__${this.dataType}`
      },

      // 当前数据类型
      dataType () {
        return getDataType(this.data)
      },

      // 父级数据类型
      parentDataType () {
        return getDataType(this.parentData)
      }
    },
    methods: {
      defaultFormatter (data) {
        let text = data + ''
        if (this.dataType === 'string') text = `"${text}"`
        if (this.showComma) text += ','
        return text
      },

      customFormatter (data) {
        return this.customValueFormatter(
          data, this.currentKey, this.parentData
        ) || this.defaultFormatter(data)
      }
    }
  }
</script>
