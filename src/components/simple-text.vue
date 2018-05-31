<template>
  <div>
    <span v-if="parentDataType === 'object'">{{ currentKey }}:</span>
    <span :class="`vjs__value__${dataType}`">
      {{ textFormatter(text) }}
    </span>
    <!-- <span v-if="notLastKey">,</span> -->
  </div>
</template>

<script>
  export default {
    props: {
      parentDataType: String, // 父级数据类型
      dataType: String, // 当前 text 数据类型
      text: String,
      notLastKey: Boolean,
      currentKey: [Number, String]
    },
    methods: {
      textFormatter (text) {
        let output = text
        if (this.dataType === 'string') output = `"${output}"`
        if (this.notLastKey) output += ','
        return output
      }
    }
  }
</script>
