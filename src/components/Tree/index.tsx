import { defineComponent, reactive, computed, watchEffect, ref } from 'vue';
import TreeNode from 'src/components/TreeNode';
import { jsonFlatten, JsonFlattenReturnType } from 'src/utils';
import './styles.less';

interface FlatDataItemType extends JsonFlattenReturnType {
  id: number;
}
[];

type FlatDataType = FlatDataItemType[];

export default defineComponent({
  name: 'Tree',

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

  emits: ['click', 'change', 'update:modelValue'],

  setup(props, { emit }) {
    const tree = ref<HTMLElement>();

    const state = reactive({
      translateY: 0,
      visibleData: null as FlatDataType | null,
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
      }, {}) as Record<string, 1>,
    });

    const flatData = computed(() => {
      let startHiddenItem: null | FlatDataItemType = null;
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
          } as FlatDataItemType;
          startHiddenItem = null;
          return acc.concat(mergeItem);
        } else if (isHidden && !startHiddenItem) {
          startHiddenItem = item;
          return acc;
        }

        return startHiddenItem ? acc : acc.concat(item);
      }, [] as FlatDataType);
      return data;
    });

    const selectedPaths = computed(() => {
      const value = props.modelValue;
      if (value && props.selectableType === 'multiple' && Array.isArray(value)) {
        return value;
      }
      return [value];
    });

    const propsErrorMessage = computed(() => {
      const error = props.selectableType && !props.selectOnClickNode && !props.showSelectController;
      return error
        ? 'When selectableType is not null, selectOnClickNode and showSelectController cannot be false at the same time, because this will cause the selection to fail.'
        : '';
    });

    const updateVisibleData = (flatDataValue: FlatDataType) => {
      if (props.virtual) {
        const treeRefValue = tree.value;
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

    const onTreeScroll = () => {
      updateVisibleData(flatData.value);
    };

    const onSelectedChange = ({ path }: FlatDataItemType) => {
      const type = props.selectableType;
      if (type === 'multiple') {
        const index = selectedPaths.value.findIndex(item => item === path);
        const newVal = [...selectedPaths.value];
        if (index !== -1) {
          newVal.splice(index, 1);
        } else {
          newVal.push(path);
        }
        emit('update:modelValue', newVal);
        emit('change', newVal, [...selectedPaths.value]);
      } else if (type === 'single') {
        if (selectedPaths.value[0] !== path) {
          const [oldVal] = selectedPaths.value;
          const newVal = path;
          emit('update:modelValue', newVal);
          emit('change', newVal, oldVal);
        }
      }
    };

    const onTreeNodeClick = ({ content, path }: FlatDataItemType) => {
      emit('click', path, content);
    };

    const onBracketsClick = (collapsed: boolean, path: string) => {
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
      if (propsErrorMessage.value) {
        throw new Error(`[VueJsonPretty] ${propsErrorMessage.value}`);
      }
    });

    watchEffect(() => {
      if (flatData.value) {
        updateVisibleData(flatData.value);
      }
    });

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

  render() {
    const {
      virtual,
      itemHeight,
      customValueFormatter,
      showDoubleQuotes,
      showLength,
      showLine,
      showSelectController,
      selectOnClickNode,
      pathSelectable,
      highlightSelectedNode,
      collapsedOnClickBrackets,
      state,
      flatData,
      selectedPaths,
      selectableType,
    } = this;

    const { onTreeNodeClick, onBracketsClick, onSelectedChange, onTreeScroll } = this;

    const nodeContent =
      state.visibleData &&
      state.visibleData.map(item => (
        <TreeNode
          key={item.id}
          node={item}
          collapsed={!!state.hiddenPaths[item.path]}
          custom-value-formatter={customValueFormatter}
          show-double-quotes={showDoubleQuotes}
          show-length={showLength}
          collapsed-on-click-brackets={collapsedOnClickBrackets}
          checked={selectedPaths.includes(item.path)}
          selectable-type={selectableType}
          show-line={showLine}
          show-select-controller={showSelectController}
          select-on-click-node={selectOnClickNode}
          path-selectable={pathSelectable}
          highlight-selected-node={highlightSelectedNode}
          onTreeNodeClick={onTreeNodeClick}
          onBracketsClick={onBracketsClick}
          onSelectedChange={onSelectedChange}
        />
      ));

    return (
      <div
        ref="tree"
        class={{
          'vjs-tree': true,
          'is-virtual': virtual,
        }}
        onScroll={onTreeScroll}
      >
        {virtual ? (
          <div style={{ height: `${flatData.length * itemHeight}px` }}>
            <div style={{ transform: `translateY(${state.translateY}px)` }}>{nodeContent}</div>
          </div>
        ) : (
          nodeContent
        )}
      </div>
    );
  },
});
