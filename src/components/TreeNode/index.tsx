import { defineComponent, reactive, computed, PropType } from 'vue';
import Brackets from 'src/components/Brackets';
import CheckController from 'src/components/CheckController';
import { getDataType } from 'src/utils';
import './styles.less';

export const treeNodePropsPass = {
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
  // custom formatter for values
  customValueFormatter: Function as PropType<
    (data: string, key: string, path: string, defaultFormatResult: string) => unknown
  >,
  // 定义数据层级支持的选中方式, 默认无该功能
  selectableType: String as PropType<'multiple' | 'single' | ''>,
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
  // collapsed control
  collapsedOnClickBrackets: {
    type: Boolean,
    default: true,
  },
  // 定义某个数据层级是否支持选中操作
  pathSelectable: {
    type: Function as PropType<() => boolean>,
    default: (): boolean => true,
  },
  // highlight current node when checked
  highlightSelectedNode: {
    type: Boolean,
    default: true,
  },
};

export default defineComponent({
  name: 'TreeNode',

  props: {
    ...treeNodePropsPass,
    node: {
      required: true,
      type: Object,
    },
    collapsed: Boolean,
    checked: Boolean,
    onTreeNodeClick: {
      type: Function,
    },
    onBracketsClick: {
      type: Function,
    },
    onSelectedChange: {
      type: Function,
    },
  },

  setup(props, { emit }) {
    // 当前数据类型
    const dataType = computed(() => getDataType(props.node.content));

    const valueClass = computed(() => `vjs-value vjs-value__${dataType.value}`);

    const prettyKey = computed(() =>
      props.showDoubleQuotes ? `"${props.node.key}"` : props.node.key,
    );

    // 多选模式
    const isMultiple = computed(() => props.selectableType === 'multiple');

    // 单选模式
    const isSingle = computed(() => props.selectableType === 'single');

    // 当前节点是否支持选中功能
    const selectable = computed(
      () =>
        props.pathSelectable(props.node.path, props.node.content) &&
        (isMultiple.value || isSingle.value),
    );

    const defaultFormatter = (data: string) => {
      let text = data + '';
      if (dataType.value === 'string') text = `"${text}"`;
      return text;
    };

    const customFormatter = (data: string) => {
      return props.customValueFormatter
        ? props.customValueFormatter(data, props.node.key, props.node.path, defaultFormatter(data))
        : defaultFormatter(data);
    };

    const onBracketsClickHandler = () => {
      if (props.collapsedOnClickBrackets) {
        emit('brackets-click', !props.collapsed, props.node.path);
      }
    };

    const onCheckedChange = () => {
      emit('selected-change', props.node);
    };

    const onNodeClick = () => {
      emit('tree-node-click', props.node);
      if (selectable.value && props.selectOnClickNode) {
        emit('selected-change', props.node);
      }
    };

    const state = reactive({
      valueClass,
      prettyKey,
      isMultiple,
      selectable,
    });

    return {
      state,
      defaultFormatter,
      customFormatter,
      onBracketsClickHandler,
      onCheckedChange,
      onNodeClick,
    };
  },

  render() {
    const {
      state,
      node,
      showSelectController,
      highlightSelectedNode,
      checked,
      showLength,
      collapsed,
      showLine,
    } = this;

    const {
      customValueFormatter,
      defaultFormatter,
      customFormatter,
      onNodeClick,
      onCheckedChange,
      onBracketsClickHandler,
    } = this;

    return (
      <div
        class={{
          'vjs-tree__node': true,
          'has-selector': showSelectController,
          'is-highlight': highlightSelectedNode && checked,
        }}
        onClick={onNodeClick}
      >
        {showSelectController &&
          state.selectable &&
          node.type !== 'objectEnd' &&
          node.type !== 'arrayEnd' && (
            <CheckController
              isMultiple={state.isMultiple}
              checked={checked}
              onChange={onCheckedChange}
            />
          )}

        {Array.from(Array(node.level)).map((item, index) => (
          <div
            key={index}
            class={{
              'vjs-tree__indent': true,
              'has-line': showLine,
            }}
          />
        ))}

        {node.key && <span class="vjs-key"> {state.prettyKey}:&nbsp; </span>}

        <span>
          {node.type !== 'content' ? (
            <Brackets data={node.content} onClick={onBracketsClickHandler} />
          ) : customValueFormatter ? (
            <span class={state.valueClass} v-html={customFormatter(node.content)} />
          ) : (
            <span class={state.valueClass}>{defaultFormatter(node.content)}</span>
          )}

          {node.showComma && <span>,</span>}

          {showLength && collapsed && <span class="vjs-comment"> // {node.length} items </span>}
        </span>
      </div>
    );
  },
});
