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
      <div :style="virtual && { transform: `translateY(${state.translateY}px)` }">
        <tree-node
          v-for="item in state.visibleData"
          :key="item.id"
          :node="item"
          :collapsed="!!state.hiddenPaths[item.path]"
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
import { reactive, computed, watchEffect, ref } from 'vue';
import TreeNode from 'src/components/TreeNode';
import { getDataType, jsonFlatten } from 'src/utils';
import './styles.less';

export default {
  name: 'VueJsonPretty',
  emits: ['click', 'change', 'update:modelValue'],
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
    modelValue: {
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
  setup(props, { emit }) {
    const tree = ref(null);

    const state = reactive({
      translateY: 0,
      visibleData: null,
      hiddenPaths: jsonFlatten(props.data, props.path).reduce((acc, item) => {
        if (
          (item.type === 'objectStart' || item.type === 'arrayStart') &&
          item.level === props.deep
        ) {
          return {
            ...acc,
            [item.path]: 1,
          };
        }
        return acc;
      }, {}),
    });

    const flatData = computed(() => {
      let startHiddenItem = null;
      const data = jsonFlatten(props.data, props.path).reduce((acc, cur, index) => {
        const item = {
          ...cur,
          id: index,
        };
        const isHidden = state.hiddenPaths[item.path];
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
    });

    let selectedPaths = computed({
      get: () => {
        if (props.modelValue && props.selectableType === 'single') {
          return [props.modelValue];
        }
        return props.modelValue || [];
      },
      set: val => emit('update:modelValue', val),
    });

    const propsErrorMessage = computed(() => {
      const error = props.selectableType && !props.selectOnClickNode && !props.showSelectController;
      return error
        ? 'When selectableType is not null, selectOnClickNode and showSelectController cannot be false at the same time, because this will cause the selection to fail.'
        : '';
    });

    const onTreeScroll = () => {
      const flatDataValue = flatData.value;
      if (props.virtual) {
        const treeRefValue = tree && tree.value;
        const visibleCount = 10;
        const scrollTop = (treeRefValue && treeRefValue.scrollTop) || 0;
        const scrollCount = Math.floor(scrollTop / props.itemHeight);
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
        state.translateY = start * props.itemHeight;
        state.visibleData = flatDataValue.filter((item, index) => index >= start && index < end);
      } else {
        state.visibleData = flatDataValue;
      }
    };

    const onSelectedChange = ({ path }) => {
      const type = props.selectableType;
      if (type === 'multiple') {
        const index = selectedPaths.value.findIndex(item => item === path);
        const oldVal = [...selectedPaths.value];
        if (index !== -1) {
          selectedPaths.value.splice(index, 1);
        } else {
          selectedPaths.value.push(path);
        }

        emit('change', [...selectedPaths.value], oldVal);
      } else if (type === 'single') {
        if (selectedPaths.value !== path) {
          const [oldVal] = selectedPaths.value;
          const newVal = path;
          selectedPaths.value = newVal;
          emit('change', newVal, oldVal);
        }
      }
    };

    const onTreeNodeClick = ({ content, path }) => {
      emit('click', path, content);
    };

    const onBracketsClick = (collapsed, path) => {
      if (collapsed) {
        state.hiddenPaths = {
          ...state.hiddenPaths,
          [path]: 1,
        };
      } else {
        const newPaths = { ...state.hiddenPaths };
        delete newPaths[path];
        state.hiddenPaths = newPaths;
      }
    };

    watchEffect(() => {
      if (propsErrorMessage && propsErrorMessage.value) {
        throw new Error(`[VueJsonPretty] ${propsErrorMessage.value}`);
      }
    });

    watchEffect(flatData => onTreeScroll());

    return {
      tree,
      state,
      flatData,
      selectedPaths,
      onTreeScroll,
      onSelectedChange,
      onTreeNodeClick,
      onBracketsClick,
    };
  },
};
</script>
