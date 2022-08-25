<template>
  <div
    :class="{
      'vjs-tree-node': true,
      'has-selector': showSelectController,
      'has-carets': showIcon,
      'is-highlight': highlightSelectedNode && checked,
    }"
    @click="handleNodeClick"
  >
    <span v-if="showLineNumber" class="vjs-node-index">
      {{ node.id + 1 }}
    </span>

    <check-controller
      v-if="
        showSelectController && selectable && node.type !== 'objectEnd' && node.type !== 'arrayEnd'
      "
      :is-multiple="isMultiple"
      :checked="checked"
      @change="handleSelectedChange"
    />

    <div class="vjs-indent">
      <div
        v-for="(item, index) in node.level"
        :key="index"
        :class="{
          'vjs-indent-unit': true,
          'has-line': showLine,
        }"
      />
      <carets v-if="showIcon" :node-type="node.type" @click="handleIconClick" />
    </div>

    <slot v-if="node.key" name="key" :node="node" :defaultKey="prettyKey">
      <span class="vjs-key">{{ prettyKey }}:</span>
    </slot>

    <span>
      <brackets v-if="node.type !== 'content'" :data="node.content" @click="handleBracketsClick" />

      <span
        v-else
        :class="valueClass"
        @click="
          editable && (!editableTrigger || editableTrigger === 'click')
            ? handleValueEdit($event)
            : undefined
        "
        @dblclick="editable && editableTrigger === 'dblclick' ? handleValueEdit($event) : undefined"
      >
        <input
          v-if="editable && editing"
          :value="defaultValue"
          @change="handleInputChange"
          :style="{
            padding: '3px 8px',
            border: '1px solid #eee',
            boxShadow: 'none',
            boxSizing: 'border-box',
            borderRadius: 5,
            fontFamily: 'inherit',
          }"
        />
        <slot v-else name="value" :node="node" :defaultValue="defaultValue">{{
          defaultValue
        }}</slot>
      </span>

      <span v-if="node.showComma">,</span>

      <span v-if="showLength && collapsed" class="vjs-comment"> // {{ node.length }} items </span>
    </span>
  </div>
</template>

<script>
import Brackets from 'src/components/Brackets';
import CheckController from 'src/components/CheckController';
import Carets from 'src/components/Carets';
import { getDataType, stringToAutoType } from 'src/utils';
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
    nodeSelectable: {
      type: Function,
      default: () => true,
    },
    // highlight current node when checked
    highlightSelectedNode: {
      type: Boolean,
      default: true,
    },
    showIcon: {
      type: Boolean,
      default: false,
    },
    editable: {
      type: Boolean,
      default: false,
    },
    editableTrigger: {
      type: String,
      default: 'click',
    },
  },
  data() {
    return {
      editing: false,
    };
  },
  computed: {
    valueClass() {
      return `vjs-value vjs-value-${this.dataType}`;
    },

    dataType() {
      return getDataType(this.node.content);
    },

    prettyKey() {
      return this.showDoubleQuotes ? `"${this.node.key}"` : this.node.key;
    },

    selectable() {
      return this.nodeSelectable(this.node) && (this.isMultiple || this.isSingle);
    },

    isMultiple() {
      return this.selectableType === 'multiple';
    },

    isSingle() {
      return this.selectableType === 'single';
    },

    defaultValue() {
      const str = (this.node?.content ?? '') + '';
      const text = this.dataType === 'string' ? `"${str}"` : str;
      return text;
    },
  },
  methods: {
    handleInputChange(e) {
      const source = e.target?.value;
      const value = stringToAutoType(source);
      this.$emit('value-change', value, this.node.path);
    },

    handleIconClick() {
      this.$emit('icon-click', !this.collapsed, this.node.path);
    },

    handleBracketsClick() {
      this.$emit('brackets-click', !this.collapsed, this.node.path);
    },

    handleSelectedChange() {
      this.$emit('selected-change', this.node);
    },

    handleNodeClick() {
      this.$emit('node-click', this.node);
      if (this.selectable && this.selectOnClickNode) {
        this.$emit('selected-change', this.node);
      }
    },

    handleValueEdit(e) {
      if (!this.editable) return;
      if (!this.editing) {
        this.editing = true;
        const handle = (innerE) => {
          if (innerE.target !== e.target && innerE.target?.parentElement !== e.target) {
            this.editing = false;
            document.removeEventListener('click', handle);
          }
        };
        document.removeEventListener('click', handle);
        document.addEventListener('click', handle);
      }
    },
  },
};
</script>
