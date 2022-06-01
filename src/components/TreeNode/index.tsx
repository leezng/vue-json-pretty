import { defineComponent, reactive, computed, PropType } from 'vue';
import Brackets from 'src/components/Brackets';
import CheckController from 'src/components/CheckController';
import { getDataType, JSONFlattenReturnType } from 'src/utils';
import './styles.less';

export interface NodeDataType extends JSONFlattenReturnType {
  id: number;
}

// The props here will be exposed to the user through the topmost component.
export const treeNodePropsPass = {
  // Whether to display the length of (array|object).
  showLength: {
    type: Boolean,
    default: false,
  },
  // Whether the key name uses double quotes.
  showDoubleQuotes: {
    type: Boolean,
    default: true,
  },
  // Whether the string values are escaped
  escapeStrings: {
    type: Boolean,
    default: true,
  },
  // Custom formatter for values.
  customValueFormatter: Function as PropType<
    (data: string, key: NodeDataType['key'], path: string, defaultFormatResult: string) => unknown
  >,
  // Define the selection method supported by the data level, which is not available by default.
  selectableType: String as PropType<'multiple' | 'single' | ''>,
  // Whether to display the selection control.
  showSelectController: {
    type: Boolean,
    default: false,
  },
  // Whether to display the data level connection.
  showLine: {
    type: Boolean,
    default: true,
  },
  // Whether to trigger selection when clicking on the node.
  selectOnClickNode: {
    type: Boolean,
    default: true,
  },
  // Collapsed control.
  collapsedOnClickBrackets: {
    type: Boolean,
    default: true,
  },
  // When using the selectableType, define whether current path/content is enabled.
  pathSelectable: {
    type: Function as PropType<(path: string, content: string) => boolean>,
    default: (): boolean => true,
  },
  // Highlight current node when selected.
  highlightSelectedNode: {
    type: Boolean,
    default: true,
  },
};

export default defineComponent({
  name: 'TreeNode',

  props: {
    ...treeNodePropsPass,
    // Current node data.
    node: {
      type: Object as PropType<NodeDataType>,
      required: true,
    },
    // Whether the current node is collapsed.
    collapsed: Boolean,
    // Whether the current node is checked(When using the selection function).
    checked: Boolean,
    onTreeNodeClick: {
      type: Function as PropType<(node: NodeDataType) => void>,
    },
    onBracketsClick: {
      type: Function as PropType<(collapsed: boolean, path: string) => void>,
    },
    onSelectedChange: {
      type: Function as PropType<(node: NodeDataType) => void>,
    },
  },

  setup(props, { emit }) {
    const dataType = computed(() => getDataType(props.node.content));

    const valueClass = computed(() => `vjs-value vjs-value__${dataType.value}`);

    const prettyKey = computed(() =>
      props.showDoubleQuotes ? `"${props.node.key}"` : props.node.key,
    );

    const isMultiple = computed(() => props.selectableType === 'multiple');

    const isSingle = computed(() => props.selectableType === 'single');

    // Whether the current node supports the selected function.
    const selectable = computed(
      () =>
        props.pathSelectable(props.node.path, props.node.content) &&
        (isMultiple.value || isSingle.value),
    );

    const defaultFormatter = (data: string) => {
      let text = data + '';
      if (dataType.value === 'string') text = props.escapeStrings ? JSON.stringify(text) : `"${text}"`;
      return text;
    };

    const customFormatter = props.customValueFormatter
      ? (data: string) =>
          props.customValueFormatter?.(
            data,
            props.node.key,
            props.node.path,
            defaultFormatter(data),
          )
      : null;

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

        {node.key && <span class="vjs-key">{`${state.prettyKey}: `}</span>}

        <span>
          {node.type !== 'content' ? (
            <Brackets data={node.content} onClick={onBracketsClickHandler} />
          ) : customFormatter ? (
            <span class={state.valueClass} v-html={customFormatter(node.content)} />
          ) : (
            <span class={state.valueClass}>{defaultFormatter(node.content)}</span>
          )}

          {node.showComma && <span>{','}</span>}

          {showLength && collapsed && <span class="vjs-comment"> // {node.length} items </span>}
        </span>
      </div>
    );
  },
});
