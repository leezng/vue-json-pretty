<template>
  <div
    class="vjs-tree__node"
    @click="onTreeNodeClick"
  >
    <template v-if="showSelectController && selectable && node.type !== 'objectEnd' && node.type !== 'arrayEnd'">
      <check-controller
        :is-multiple="isMultiple"
        :checked="checked"
        @change="onCheckedChange"
      />
    </template>

    <div
      v-for="(item, index) in node.level"
      :key="index"
      :class="{
        'vjs-tree__indent': true,
        'has-line': showLine
      }"
    />
    <span
      v-if="node.key"
      class="vjs-key"
    >
      {{ prettyKey }}:&nbsp;
    </span>

    <span>
      <brackets
        v-if="node.type !== 'content'"
        :data="node.content"
        :collapsed-on-click-brackets="collapsedOnClickBrackets"
        @click="onBracketsClick"
      />

      <template v-else>
        <span
          v-if="customValueFormatter"
          :class="valueClass"
          v-html="customFormatter(node.content)"
        />
        <span
          v-else
          :class="valueClass"
        >{{ defaultFormatter(node.content) }}</span>
      </template>

      <span v-if="node.showComma">,</span>

      <span
        v-if="showLength && collapsed"
        class="vjs-comment"
      >
        // {{ node.length }} items
      </span>
    </span>
  </div>
</template>

<script>
  import Brackets from 'src/components/Brackets'
  import CheckController from 'src/components/CheckController'
  import { getDataType } from 'src/utils'
  import './styles.less'

  export default {
    components: {
      Brackets,
      CheckController,
    },
    props: {
      node: {
        required: true,
        type: Object,
      },
      collapsed: Boolean,
      collapsedOnClickBrackets: Boolean,
      showDoubleQuotes: Boolean,
      showLength: Boolean,
      checked: Boolean,
      // 定义数据层级支持的选中方式, 默认无该功能
      selectableType: {
        type: String,
        default: '' // ''|multiple|single
      },
      // 是否展示左侧选择控件
      showSelectController: {
        type: Boolean,
        default: false
      },
      showLine: {
        type: Boolean,
        default: true
      },
      // 是否在点击树的时候选中节点
      selectOnClickNode: {
        type: Boolean,
        default: true
      },
      // 定义某个数据层级是否支持选中操作
      pathSelectable: {
        type: Function,
        default: () => true
      },
      // highlight current node when mouseover
      highlightMouseoverNode: {
        type: Boolean,
        default: false
      },
      // highlight current node when checked
      highlightSelectedNode: {
        type: Boolean,
        default: true
      },
      // custom formatter for values
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
        return getDataType(this.node.content)
      },

      prettyKey () {
        return this.showDoubleQuotes ? `"${this.node.key}"` : this.node.key
      },

      // 当前的树是否支持选中功能
      selectable () {
        return this.pathSelectable(this.node.path, this.node.content) && (this.isMultiple || this.isSingle)
      },

      // 多选模式
      isMultiple () {
        return this.selectableType === 'multiple'
      },

      // 单选模式
      isSingle () {
        return this.selectableType === 'single'
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
          ? this.customValueFormatter(data, this.node.key, this.node.path, this.defaultFormatter(data))
          : this.defaultFormatter(data)
      },

      onBracketsClick () {
        this.$emit('brackets-click', !this.collapsed, this.node.path)
      },

      onCheckedChange () {
        this.$emit('selected-change', this.node)
      },

      onTreeNodeClick () {
        this.$emit('tree-node-click', this.node)
        if (this.selectable && this.selectOnClickNode) {
          this.$emit('selected-change', this.node)
        }
      },
    }
  }
</script>
