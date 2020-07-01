<template>
  <div>
    <slot></slot>
    <span :class="`vjs-value vjs-value__${dataType}`" v-html="textFormatter(data)"/>
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

      textFormatter (data) {
        if (this.customValueFormatter) {
          return this.customValueFormatter(
            data, this.currentKey, this.parentData
          ) || this.defaultFormatter(data)
        } else {
          return this.defaultFormatter(data)
        }
      }
    }
  }
</script>
