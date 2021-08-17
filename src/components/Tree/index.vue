<template>
  <div
    ref="tree"
    :class="{
      'vjs-tree': true,
      'is-virtual': virtual,
    }"
    @scroll="onTreeScroll"
  >
    <div :style="virtual && { height: `${flatData.length * itemHeight}px` }">
      <div :style="virtual && { transform: `translateY(${translateY}px)` }">
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
          :show-select-controller="showSelectController"
          :select-on-click-node="selectOnClickNode"
          :path-selectable="pathSelectable"
          :highlight-selected-node="highlightSelectedNode"
          @tree-node-click="onTreeNodeClick"
          @brackets-click="onBracketsClick"
          @selected-change="onSelectedChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
import TreeNode from 'src/components/TreeNode';
import { getDataType, jsonFlatten } from 'src/utils';
import './styles.less';

export default {
  name: 'VueJsonPretty',
  components: {
    TreeNode,
  },
  props: {
    // 当前树的数据
    data: {
      type: [String, Number, Boolean, Array, Object],
      default: null,
    },
    // 定义树的深度, 大于该深度的子树将不被展开
    deep: {
      type: Number,
      default: Infinity,
    },
    deepCollapseChildren: {
      type: Boolean,
      default: false,
    },
    // 数据层级顶级路径
    path: {
      type: String,
      default: 'root',
    },
    virtual: {
      type: Boolean,
      default: false,
    },
    itemHeight: {
      type: Number,
      default: 20,
    },
    // 是否显示数组|对象的长度
    showLength: {
      type: Boolean,
      default: false,
    },
    // key名是否显示双引号
    showDoubleQuotes: {
      type: Boolean,
      default: true,
    },
    // 定义数据层级支持的选中方式, 默认无该功能
    selectableType: {
      type: String,
      default: '', // ''|multiple|single
    },
    // 是否展示左侧选择控件
    showSelectController: {
      type: Boolean,
      default: false,
    },
    showLine: {
      type: Boolean,
      default: true,
    },
    // 是否在点击树的时候选中节点
    selectOnClickNode: {
      type: Boolean,
      default: true,
    },
    // 存在选择功能时, 定义已选中的数据层级
    //    多选时为数组['root.a', 'root.b'], 单选时为字符串'root.a'
    value: {
      type: [Array, String],
      default: () => '',
    },
    // 定义某个数据层级是否支持选中操作
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
  },
  data() {
    return {
      translateY: 0,
      visibleData: null,
      hiddenPaths: jsonFlatten(this.data, this.path).reduce((acc, item) => {
        const depthComparison = this.deepCollapseChildren
          ? item.level >= this.deep
          : item.level === this.deep;
        if (
          (item.type === 'objectStart' || item.type === 'arrayStart') &&
          depthComparison
        ) {
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
    flatData() {
      let startHiddenItem = null;
      const data = jsonFlatten(this.data, this.path).reduce((acc, cur, index) => {
        const item = {
          ...cur,
          id: index,
        };
        const isHidden = this.hiddenPaths[item.path];
        if (startHiddenItem && startHiddenItem.path === item.path) {
          const isObject = startHiddenItem.type === 'objectStart';
          const mergeItem = {
            ...startHiddenItem,
            ...item,
            content: isObject ? '{...}' : '[...]',
            type: isObject ? 'objectCollapsed' : 'arrayCollapsed',
          };
          startHiddenItem = null;
          return acc.concat(mergeItem);
        } else if (isHidden && !startHiddenItem) {
          startHiddenItem = item;
          return acc;
        }

        return startHiddenItem ? acc : acc.concat(item);
      }, []);
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
      handler() {
        this.onTreeScroll();
      },
      immediate: true,
    },
  },
  methods: {
    onTreeScroll() {
      if (this.virtual) {
        const visibleCount = 10;
        const scrollTop = (this.$refs.tree && this.$refs.tree.scrollTop) || 0;
        const scrollCount = Math.floor(scrollTop / this.itemHeight);
        let start =
          scrollCount < 0
            ? 0
            : scrollCount + visibleCount > this.flatData.length
            ? this.flatData.length - visibleCount
            : scrollCount;
        if (start < 0) {
          start = 0;
        }
        const end = start + visibleCount;
        this.translateY = start * this.itemHeight;
        this.visibleData = this.flatData.filter((item, index) => index >= start && index < end);
      } else {
        this.visibleData = this.flatData;
      }
    },

    onSelectedChange({ path }) {
      const type = this.selectableType;
      if (type === 'multiple') {
        const index = this.selectedPaths.findIndex(item => item === path);
        const oldVal = [...this.selectedPaths];
        if (index !== -1) {
          this.selectedPaths.splice(index, 1);
        } else {
          this.selectedPaths.push(path);
        }

        this.$emit('change', this.selectedPaths, oldVal);
      } else if (type === 'single') {
        if (this.selectedPaths !== path) {
          const oldVal = this.selectedPaths;
          const newVal = path;
          this.selectedPaths = newVal;
          this.$emit('change', newVal, oldVal);
        }
      }
    },

    onTreeNodeClick({ content, path }) {
      this.$emit('click', path, content);
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
