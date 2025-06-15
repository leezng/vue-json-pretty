import {
  defineComponent,
  reactive,
  computed,
  watchEffect,
  watch,
  ref,
  PropType,
  CSSProperties,
} from 'vue';
import TreeNode, { treeNodePropsPass, NodeDataType } from 'src/components/TreeNode';
import { emitError, jsonFlatten, cloneDeep } from 'src/utils';
import './styles.less';

export default defineComponent({
  name: 'Tree',

  props: {
    ...treeNodePropsPass,
    collapsedNodeLength: {
      type: Number,
      default: Infinity,
    },
    // Define the depth of the tree, nodes greater than this depth will not be expanded.
    deep: {
      type: Number,
      default: Infinity,
    },
    pathCollapsible: {
      type: Function as PropType<(node: NodeDataType) => boolean>,
      default: (): boolean => false,
    },
    // Whether to use virtual scroll, usually applied to big data.
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
    // When there is a selection function, define the selected path.
    // For multiple selections, it is an array ['root.a','root.b'], for single selection, it is a string of 'root.a'.
    selectedValue: {
      type: [String, Array] as PropType<string | string[]>,
      default: () => '',
    },
    // Collapsed control.
    collapsedOnClickBrackets: {
      type: Boolean,
      default: true,
    },
    style: Object as PropType<CSSProperties>,
    onSelectedChange: {
      type: Function as PropType<(newVal: string | string[], oldVal: string | string[]) => void>,
    },
    theme: {
      type: String as PropType<'light' | 'dark'>,
      default: 'light',
    },
  },

  slots: ['renderNodeKey', 'renderNodeValue', 'renderNodeActions'],

  emits: [
    'nodeClick',
    'nodeMouseover',
    'bracketsClick',
    'iconClick',
    'selectedChange',
    'update:selectedValue',
    'update:data',
  ],

  setup(props, { emit, slots }) {
    const treeRef = ref<HTMLElement>();

    const originFlatData = computed(() => jsonFlatten(props.data, props.rootPath));

    const initHiddenPaths = (deep: number, collapsedNodeLength: number) => {
      return originFlatData.value.reduce((acc, item) => {
        const doCollapse = item.level >= deep || item.length >= collapsedNodeLength;
        const pathComparison = props.pathCollapsible?.(item as NodeDataType);
        if (
          (item.type === 'objectStart' || item.type === 'arrayStart') &&
          (doCollapse || pathComparison)
        ) {
          return {
            ...acc,
            [item.path]: 1,
          };
        }
        return acc;
      }, {}) as Record<string, 1>;
    };

    const state = reactive({
      translateY: 0,
      visibleData: null as NodeDataType[] | null,
      hiddenPaths: initHiddenPaths(props.deep, props.collapsedNodeLength),
    });

    const flatData = computed(() => {
      let startHiddenItem: null | NodeDataType = null;
      const data = [];
      const length = originFlatData.value.length;
      for (let i = 0; i < length; i++) {
        const cur = originFlatData.value[i];
        const item = {
          ...cur,
          id: i,
        };
        const isHidden = state.hiddenPaths[item.path];
        if (startHiddenItem && startHiddenItem.path === item.path) {
          const isObject = startHiddenItem.type === 'objectStart';
          const mergeItem = {
            ...item,
            ...startHiddenItem,
            showComma: item.showComma,
            content: isObject ? '{...}' : '[...]',
            type: isObject ? 'objectCollapsed' : 'arrayCollapsed',
          } as NodeDataType;
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
    });

    const selectedPaths = computed(() => {
      const value = props.selectedValue;
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

    const updateVisibleData = () => {
      const flatDataValue = flatData.value;
      if (props.virtual) {
        const visibleCount = props.height / props.itemHeight;
        const scrollTop = treeRef.value?.scrollTop || 0;
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

    const handleTreeScroll = () => {
      updateVisibleData();
    };

    const handleSelectedChange = ({ path }: NodeDataType) => {
      const type = props.selectableType;
      if (type === 'multiple') {
        const index = selectedPaths.value.findIndex(item => item === path);
        const newVal = [...selectedPaths.value];
        if (index !== -1) {
          newVal.splice(index, 1);
        } else {
          newVal.push(path);
        }
        emit('update:selectedValue', newVal);
        emit('selectedChange', newVal, [...selectedPaths.value]);
      } else if (type === 'single') {
        if (selectedPaths.value[0] !== path) {
          const [oldVal] = selectedPaths.value;
          const newVal = path;
          emit('update:selectedValue', newVal);
          emit('selectedChange', newVal, oldVal);
        }
      }
    };

    const handleNodeClick = (node: NodeDataType) => {
      emit('nodeClick', node);
    };

    const handleNodeMouseover = (node: NodeDataType) => {
      emit('nodeMouseover', node);
    };

    const updateCollapsedPaths = (collapsed: boolean, path: string) => {
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

    const handleBracketsClick = (collapsed: boolean, node: NodeDataType) => {
      if (props.collapsedOnClickBrackets) {
        updateCollapsedPaths(collapsed, node.path);
      }
      emit('bracketsClick', collapsed, node);
    };

    const handleIconClick = (collapsed: boolean, node: NodeDataType) => {
      updateCollapsedPaths(collapsed, node.path);
      emit('iconClick', collapsed, node);
    };

    const handleValueChange = (value: unknown, path: string) => {
      const newData = cloneDeep(props.data);
      const rootPath = props.rootPath;
      new Function('data', 'val', `data${path.slice(rootPath.length)}=val`)(newData, value);
      emit('update:data', newData);
    };

    watchEffect(() => {
      if (propsErrorMessage.value) {
        emitError(propsErrorMessage.value);
      }
    });

    watchEffect(() => {
      if (flatData.value) {
        updateVisibleData();
      }
    });

    watch(
      () => props.deep,
      val => {
        if (val) state.hiddenPaths = initHiddenPaths(val, props.collapsedNodeLength);
      },
    );

    watch(
      () => props.collapsedNodeLength,
      val => {
        if (val) state.hiddenPaths = initHiddenPaths(props.deep, val);
      },
    );

    return () => {
      const renderNodeKey = props.renderNodeKey ?? slots.renderNodeKey;
      const renderNodeValue = props.renderNodeValue ?? slots.renderNodeValue;
      const renderNodeActions = props.renderNodeActions || slots.renderNodeActions || false;
      
      const nodeContent =
        state.visibleData &&
        state.visibleData.map(item => (
          <TreeNode
            key={item.id}
            data={props.data}
            rootPath={props.rootPath}
            indent={props.indent}
            node={item}
            collapsed={!!state.hiddenPaths[item.path]}
            theme={props.theme}
            showDoubleQuotes={props.showDoubleQuotes}
            showLength={props.showLength}
            checked={selectedPaths.value.includes(item.path)}
            selectableType={props.selectableType}
            showLine={props.showLine}
            showLineNumber={props.showLineNumber}
            showSelectController={props.showSelectController}
            selectOnClickNode={props.selectOnClickNode}
            nodeSelectable={props.nodeSelectable}
            highlightSelectedNode={props.highlightSelectedNode}
            editable={props.editable}
            editableTrigger={props.editableTrigger}
            showIcon={props.showIcon}
            showKeyValueSpace={props.showKeyValueSpace}
            renderNodeKey={renderNodeKey}
            renderNodeValue={renderNodeValue}
            renderNodeActions={renderNodeActions}
            onNodeClick={handleNodeClick}
            onNodeMouseover={handleNodeMouseover}
            onBracketsClick={handleBracketsClick}
            onIconClick={handleIconClick}
            onSelectedChange={handleSelectedChange}
            onValueChange={handleValueChange}
            style={
              props.itemHeight && props.itemHeight !== 20
                ? { lineHeight: `${props.itemHeight}px` }
                : {}
            }
          />
        ));

      return (
        <div
          ref={treeRef}
          class={{
            'vjs-tree': true,
            'is-virtual': props.virtual,
            dark: props.theme === 'dark',
          }}
          onScroll={props.virtual ? handleTreeScroll : undefined}
          style={
            props.showLineNumber
              ? {
                  paddingLeft: `${Number(originFlatData.value.length.toString().length) * 12}px`,
                  ...props.style,
                }
              : props.style
          }
        >
          {props.virtual ? (
            <div class="vjs-tree-list" style={{ height: `${props.height}px` }}>
              <div
                class="vjs-tree-list-holder"
                style={{ height: `${flatData.value.length * props.itemHeight}px` }}
              >
                <div
                  class="vjs-tree-list-holder-inner"
                  style={{ transform: `translateY(${state.translateY}px)` }}
                >
                  {nodeContent}
                </div>
              </div>
            </div>
          ) : (
            nodeContent
          )}
        </div>
      );
    };
  },
});
