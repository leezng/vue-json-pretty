<template>
  <div>
    <slot></slot>
    <span :class="`vjs-value__${dataType}`">
      {{ textFormatter(data) }}
    </span>
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
      currentKey: [Number, String]
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
      textFormatter (data) {
        let text = data + ''
        if (this.dataType === 'string') text = `"${text}"`
        if (this.showComma) text += ','
        return text
      }
    }
  }
</script>
