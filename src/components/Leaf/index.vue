<template>
  <div>
    <div :style="{ flex: `0 0 ${level * 1}em` }" />
    <span
      v-if="currentKey"
      class="vjs-key"
    >
      {{ prettyKey }}:&nbsp;
    </span>

    <span>
      <brackets
        v-if="data === '[' || data === ']' || data === '{' || data === '}' || data === '{...}' || data === '[...]'"
        :data="data"
        :collapsed-on-click-brackets="collapsedOnClickBrackets"
        @click="onBracketsClick"
      />

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

      <span
        v-if="showLength && collapsed"
        class="vjs-comment"
      >
        // {{ length }} items
      </span>
    </span>
  </div>
</template>

<script>
  import Brackets from 'src/components/Brackets'
  import { getDataType } from 'src/utils'

  export default {
    components: {
      Brackets
    },
    props: {
      collapsed: Boolean,
      path: {
        required: true,
        type: String
      },
      level: {
        type: Number,
        default: 0,
      },
      length: {
        type: Number,
        default: 1,
      },
      data: {
        required: true,
        type: [String, Number, Boolean],
      },
      currentKey: {
        type: [Number, String],
        default: ''
      },
      customValueFormatter: {
        type: Function,
        default: null
      },
      collapsedOnClickBrackets: Boolean,
      showDoubleQuotes: Boolean,
      showComma: Boolean,
      showLength: Boolean,
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
    methods: {
      defaultFormatter (data) {
        let text = data + ''
        if (this.dataType === 'string') text = `"${text}"`
        return text
      },

      customFormatter (data) {
        return this.customValueFormatter
          ? this.customValueFormatter(data, this.currentKey, this.path, this.defaultFormatter(data))
          : this.defaultFormatter(data)
      },

      onBracketsClick () {
        this.$emit('brackets-click', !this.collapsed, this.path)
      },
    }
  }
</script>
