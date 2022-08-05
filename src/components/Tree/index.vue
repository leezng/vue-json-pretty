<template>
  <div
    ref="tree"
    :class="{
      'vjs-tree': true,
      'is-virtual': virtual,
    }"
    @scroll="virtual ? onTreeScroll() : undefined"
    :style="
      showLineNumber ? { paddingLeft: `${Number(flatData.length.toString().length) * 12}px` } : {}
    "
  >
    <div class="vjs-tree-list" :style="virtual && { height: `${height}px` }">
      <div
        class="vjs-tree-list__holder"
        :style="virtual && { height: `${flatData.length * itemHeight}px` }"
      >
        <div
          class="vjs-tree-list__holder-inner"
          :style="virtual && { transform: `translateY(${translateY}px)` }"
        >
          <tree-node
            v-for="item in visibleData"
            :key="item.id"
            :node="item"
            :collapsed="!!hiddenPaths[item.path]"
            :custom-value-formatter="customValueFormatter"
            :show-double-quotes="showDoubleQuotes"
            :show-length="showLength"
            :collapsed-on-click-brackets="collapsedOnClickBrackets"
            :checked="selectedPaths.includes(item.path)"
            :selectable-type="selectableType"
            :show-line="showLine"
            :show-line-number="showLineNumber"
            :show-select-controller="showSelectController"
            :select-on-click-node="selectOnClickNode"
            :path-selectable="pathSelectable"
            :highlight-selected-node="highlightSelectedNode"
            :show-icon="showIcon"
            @tree-node-click="onTreeNodeClick"
            @brackets-click="onBracketsClick"
            @selected-change="onSelectedChange"
            :style="itemHeight && itemHeight !== 20 ? { lineHeight: `${itemHeight}px` } : {}"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TreeNode from 'src/components/TreeNode';
import { jsonFlatten } from 'src/utils';
import './styles.less';

export default {
  name: 'VueJsonPretty',
  components: {
    TreeNode,
  },
  props: {
    // JSON
    data: {
      type: [String, Number, Boolean, Array, Object],
      default: null,
    },
    deep: {
      type: Number,
      default: Infinity,
    },
    deepCollapseChildren: {
      type: Boolean,
      default: false,
    },
    // define root path
    path: {
      type: String,
      default: 'root',
    },
    virtual: {
      type: Boolean,
      default: false,
    },
    // When using virtual scroll, set the height of tree.
    height: {
      type: Number,
      default: 400,
    },
    // When using virtual scroll, define the height of each row.
    itemHeight: {
      type: Number,
      default: 20,
    },
    showLength: {
      type: Boolean,
      default: false,
    },
    // showDoubleQuotes on key
    showDoubleQuotes: {
      type: Boolean,
      default: true,
    },
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
    // When there is a selection function, define the selected path.
    // For multiple selections, it is an array ['root.a','root.b'], for single selection, it is a string of 'root.a'.
    value: {
      type: [Array, String],
      default: () => '',
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
    // collapsed control
    collapsedOnClickBrackets: {
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
  data() {
    return {
      translateY: 0,
      visibleData: null,
      hiddenPaths: jsonFlatten(this.data, this.path).reduce((acc, item) => {
        const depthComparison = this.deepCollapseChildren
          ? item.level >= this.deep
          : item.level === this.deep;
        if ((item.type === 'objectStart' || item.type === 'arrayStart') && depthComparison) {
          return {
            ...acc,
            [item.path]: 1,
          };
        }
        return acc;
      }, {}),
    };
  },
  computed: {
    originFlatData() {
      return jsonFlatten(this.data, this.path);
    },

    flatData({ originFlatData, hiddenPaths }) {
      // Avoid accessing `this` in a loop to improve performance
      let startHiddenItem = null;
      const data = [];
      const length = originFlatData.length;
      for (let i = 0; i < length; i++) {
        const cur = originFlatData[i];
        const item = {
          ...cur,
          id: i,
        };
        const isHidden = hiddenPaths[item.path];
        if (startHiddenItem && startHiddenItem.path === item.path) {
          const isObject = startHiddenItem.type === 'objectStart';
          const mergeItem = {
            ...item,
            ...startHiddenItem,
            showComma: item.showComma,
            content: isObject ? '{...}' : '[...]',
            type: isObject ? 'objectCollapsed' : 'arrayCollapsed',
          };
          startHiddenItem = null;
          data.push(mergeItem);
        } else if (isHidden && !startHiddenItem) {
          startHiddenItem = item;
          continue;
        } else {
          if (startHiddenItem) continue;
          else data.push(item);
        }
      }
      return data;
    },

    selectedPaths: {
      get() {
        if (this.value && this.selectableType === 'single') {
          return [this.value];
        }
        return this.value || [];
      },
      set(val) {
        this.$emit('input', val);
      },
    },

    propsError() {
      const error = this.selectableType && !this.selectOnClickNode && !this.showSelectController;
      return error
        ? 'When selectableType is not null, selectOnClickNode and showSelectController cannot be false at the same time, because this will cause the selection to fail.'
        : '';
    },
  },
  watch: {
    propsError: {
      handler(message) {
        if (message) {
          throw new Error(`[VueJsonPretty] ${message}`);
        }
      },
      immediate: true,
    },

    flatData: {
      handler(val) {
        this.updateVisibleData(val);
      },
      immediate: true,
    },
  },
  methods: {
    updateVisibleData(flatDataValue) {
      if (this.virtual) {
        const visibleCount = this.height / this.itemHeight;
        const scrollTop = (this.$refs.tree && this.$refs.tree.scrollTop) || 0;
        const scrollCount = Math.floor(scrollTop / this.itemHeight);
        let start =
          scrollCount < 0
            ? 0
            : scrollCount + visibleCount > flatDataValue.length
            ? flatDataValue.length - visibleCount
            : scrollCount;
        if (start < 0) {
          start = 0;
        }
        const end = start + visibleCount;
        this.translateY = start * this.itemHeight;
        this.visibleData = flatDataValue.filter((item, index) => index >= start && index < end);
      } else {
        this.visibleData = flatDataValue;
      }
    },

    onTreeScroll() {
      this.updateVisibleData(this.flatData);
    },

    onSelectedChange({ path }) {
      const type = this.selectableType;
      if (type === 'multiple') {
        const index = this.selectedPaths.findIndex((item) => item === path);
        const oldVal = [...this.selectedPaths];
        if (index !== -1) {
          this.selectedPaths.splice(index, 1);
        } else {
          this.selectedPaths.push(path);
        }

        this.$emit('selected-change', this.selectedPaths, oldVal);
      } else if (type === 'single') {
        if (this.selectedPaths !== path) {
          const oldVal = this.selectedPaths;
          const newVal = path;
          this.selectedPaths = newVal;
          this.$emit('selected-change', newVal, oldVal);
        }
      }
    },

    onTreeNodeClick({ content, path }) {
      this.$emit('node-click', path, content);
    },

    onBracketsClick(collapsed, path) {
      if (collapsed) {
        this.hiddenPaths = {
          ...this.hiddenPaths,
          [path]: 1,
        };
      } else {
        const newPaths = { ...this.hiddenPaths };
        delete newPaths[path];
        this.hiddenPaths = newPaths;
      }
    },
  },
};
</script>
