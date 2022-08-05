<template>
  <div
    :class="{
      'vjs-tree__node': true,
      'has-selector': showSelectController,
      'has-carets': showIcon,
      'is-highlight': highlightSelectedNode && checked,
    }"
    @click="onTreeNodeClick"
  >
    <span v-if="showLineNumber" class="vjs-node__index">
      {{ node.id + 1 }}
    </span>

    <check-controller
      v-if="
        showSelectController && selectable && node.type !== 'objectEnd' && node.type !== 'arrayEnd'
      "
      :is-multiple="isMultiple"
      :checked="checked"
      @change="onCheckedChange"
    />

    <div class="vjs-indent">
      <div
        v-for="(item, index) in node.level"
        :key="index"
        :class="{
          'vjs-indent__unit': true,
          'has-line': showLine,
        }"
      />
      <carets v-if="showIcon" :node-type="node.type" @click="onBracketsClick" />
    </div>

    <span v-if="node.key" class="vjs-key">{{ prettyKey }}:</span>

    <span>
      <brackets
        v-if="node.type !== 'content'"
        :data="node.content"
        :collapsed-on-click-brackets="collapsedOnClickBrackets"
        @click="onBracketsClick"
      />

      <span
        v-else-if="customValueFormatter"
        :class="valueClass"
        v-html="valueFormatter(node.content)"
      ></span>
      <span v-else :class="valueClass" v-text="valueFormatter(node.content)" />

      <span v-if="node.showComma">,</span>

      <span v-if="showLength && collapsed" class="vjs-comment"> // {{ node.length }} items </span>
    </span>
  </div>
</template>

<script>
import Brackets from 'src/components/Brackets';
import CheckController from 'src/components/CheckController';
import Carets from 'src/components/Carets';
import { getDataType } from 'src/utils';
import './styles.less';

export default {
  components: {
    Brackets,
    CheckController,
    Carets,
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
    // Define the selection method supported by the data level, which is not available by default.
    selectableType: {
      type: String,
      default: '', // ''|multiple|single
    },
    // Whether to display the selection control.
    showSelectController: {
      type: Boolean,
      default: false,
    },
    showLine: {
      type: Boolean,
      default: true,
    },
    showLineNumber: {
      type: Boolean,
      default: false,
    },
    // Whether to trigger selection when clicking on the node.
    selectOnClickNode: {
      type: Boolean,
      default: true,
    },
    // When using the selectableType, define whether current path/content is enabled.
    pathSelectable: {
      type: Function,
      default: () => true,
    },
    // highlight current node when checked
    highlightSelectedNode: {
      type: Boolean,
      default: true,
    },
    // custom formatter for values
    customValueFormatter: {
      type: Function,
      default: null,
    },
    showIcon: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    valueClass() {
      return `vjs-value vjs-value__${this.dataType}`;
    },

    // 当前数据类型
    dataType() {
      return getDataType(this.node.content);
    },

    prettyKey() {
      return this.showDoubleQuotes ? `"${this.node.key}"` : this.node.key;
    },

    // 当前的树是否支持选中功能
    selectable() {
      return (
        this.pathSelectable(this.node.path, this.node.content) && (this.isMultiple || this.isSingle)
      );
    },

    // 多选模式
    isMultiple() {
      return this.selectableType === 'multiple';
    },

    // 单选模式
    isSingle() {
      return this.selectableType === 'single';
    },
  },
  methods: {
    defaultFormatter(data) {
      let text = data + '';
      if (this.dataType === 'string') text = `"${text}"`;
      return text;
    },

    valueFormatter(data) {
      const basic = this.customValueFormatter
        ? this.customValueFormatter(
            data,
            this.node.key,
            this.node.path,
            this.defaultFormatter(data),
          )
        : this.defaultFormatter(data);

      return basic;
    },

    onBracketsClick() {
      if (this.collapsedOnClickBrackets) {
        this.$emit('brackets-click', !this.collapsed, this.node.path);
      }
    },

    onCheckedChange() {
      this.$emit('selected-change', this.node);
    },

    onTreeNodeClick() {
      this.$emit('tree-node-click', this.node);
      if (this.selectable && this.selectOnClickNode) {
        this.$emit('selected-change', this.node);
      }
    },
  },
};
</script>
