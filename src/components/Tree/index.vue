<template>
  <div
    ref="tree"
    :class="{
      'vjs-tree': true,
      'is-virtual': virtual,
    }"
    @scroll="virtual ? handleTreeScroll() : undefined"
    :style="
      showLineNumber ? { paddingLeft: `${Number(flatData.length.toString().length) * 12}px` } : {}
    "
  >
    <div class="vjs-tree-list" :style="virtual && { height: `${height}px` }">
      <div
        class="vjs-tree-list-holder"
        :style="virtual && { height: `${flatData.length * itemHeight}px` }"
      >
        <div
          class="vjs-tree-list-holder-inner"
          :style="virtual && { transform: `translateY(${translateY}px)` }"
        >
          <tree-node
            v-for="item in visibleData"
            :key="item.id"
            :node="item"
            :collapsed="!!hiddenPaths[item.path]"
            :show-double-quotes="showDoubleQuotes"
            :show-length="showLength"
            :collapsed-on-click-brackets="collapsedOnClickBrackets"
            :checked="selectedPaths.includes(item.path)"
            :selectable-type="selectableType"
            :show-line="showLine"
            :show-line-number="showLineNumber"
            :show-select-controller="showSelectController"
            :select-on-click-node="selectOnClickNode"
            :node-selectable="nodeSelectable"
            :highlight-selected-node="highlightSelectedNode"
            :show-icon="showIcon"
            :editable="editable"
            :editable-trigger="editableTrigger"
            @node-click="handleNodeClick"
            @brackets-click="handleBracketsClick"
            @icon-click="handleIconClick"
            @selected-change="handleSelectedChange"
            @value-change="handleValueChange"
            :style="itemHeight && itemHeight !== 20 ? { lineHeight: `${itemHeight}px` } : {}"
          >
            <template #value="slotProps">
              <slot
                name="nodeValue"
                :node="slotProps.node"
                :defaultValue="slotProps.defaultValue"
              />
            </template>
          </tree-node>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TreeNode from 'src/components/TreeNode';
import { jsonFlatten, cloneDeep } from 'src/utils';
import './styles.less';

export default {
  name: 'VueJsonPretty',
  components: {
    TreeNode,
  },
  model: {
    prop: 'data',
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
    // define root path
    rootPath: {
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
    selectedValue: {
      type: [Array, String],
      default: () => '',
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
    // collapsed control
    collapsedOnClickBrackets: {
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
      translateY: 0,
      visibleData: null,
      hiddenPaths: jsonFlatten(this.data, this.rootPath).reduce((acc, item) => {
        const depthComparison = item.level >= this.deep;
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
      return jsonFlatten(this.data, this.rootPath);
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
        const value = this.selectedValue;
        if (value && this.selectableType === 'multiple' && Array.isArray(value)) {
          return value;
        }
        return [value];
      },
      set(val) {
        this.$emit('update:selectedValue', val);
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

    handleTreeScroll() {
      this.updateVisibleData(this.flatData);
    },

    handleSelectedChange({ path }) {
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
        if (this.selectedPaths[0] !== path) {
          const [oldVal] = this.selectedPaths;
          const newVal = path;
          this.selectedPaths = newVal;
          this.$emit('selected-change', newVal, oldVal);
        }
      }
    },

    handleNodeClick(node) {
      this.$emit('node-click', node);
    },

    updateCollapsedPaths(collapsed, path) {
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

    handleBracketsClick(collapsed, path) {
      if (this.collapsedOnClickBrackets) {
        this.updateCollapsedPaths(collapsed, path);
      }
      this.$emit('brackets-click', collapsed);
    },

    handleIconClick(collapsed, path) {
      this.updateCollapsedPaths(collapsed, path);
      this.$emit('icon-click', collapsed);
    },

    handleValueChange(value, path) {
      const newData = cloneDeep(this.data);
      const rootPath = this.rootPath;
      new Function('data', 'val', `data${path.slice(rootPath.length)}=val`)(newData, value);
      this.$emit('input', newData);
    },
  },
};
</script>
