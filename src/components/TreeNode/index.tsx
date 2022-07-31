import { defineComponent, reactive, computed, PropType } from 'vue';
import Brackets from 'src/components/Brackets';
import CheckController from 'src/components/CheckController';
import Carets from 'src/components/Carets';
import { getDataType, JSONFlattenReturnType, stringToAutoType } from 'src/utils';
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
  // Custom formatter for values.
  customValueFormatter: Function as PropType<
    (
      data: unknown,
      key: NodeDataType['key'],
      path: string,
      defaultFormatResult: string | JSX.Element,
    ) => unknown
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
    type: Function as PropType<(path: string, content: unknown) => boolean>,
    default: (): boolean => true,
  },
  // Highlight current node when selected.
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
    type: String as PropType<'click' | 'dblclick'>,
    default: 'click',
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
    onValueChange: {
      type: Function as PropType<(value: boolean, path: string) => void>,
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

    const state = reactive({
      editing: false,
      valueClass,
      prettyKey,
      isMultiple,
      selectable,
    });

    const onInputChange = (e: Event) => {
      const source = (e.target as HTMLInputElement)?.value;
      const value = stringToAutoType(source);
      emit('value-change', value, props.node.path);
    };

    const defaultFormatter = (data: unknown) => {
      const str = data + '';
      const text = dataType.value === 'string' ? `"${str}"` : str;
      if (props.editable && state.editing) {
        return (
          <input
            value={text}
            onChange={onInputChange}
            style={{
              padding: '3px 8px',
              border: '1px solid #eee',
              boxShadow: 'none',
              boxSizing: 'border-box',
              borderRadius: 5,
              fontFamily: 'inherit',
            }}
          />
        );
      }
      return text;
    };

    const customFormatter = props.customValueFormatter
      ? (data: unknown) =>
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

    const onValueEdit = (e: MouseEvent) => {
      if (!props.editable) return;
      if (!state.editing) {
        state.editing = true;
        const handle = (innerE: MouseEvent) => {
          if (
            innerE.target !== e.target &&
            (innerE.target as Element)?.parentElement !== e.target
          ) {
            state.editing = false;
            document.removeEventListener('click', handle);
          }
        };
        document.removeEventListener('click', handle);
        document.addEventListener('click', handle);
      }
    };

    return {
      state,
      defaultFormatter,
      customFormatter,
      onBracketsClickHandler,
      onCheckedChange,
      onNodeClick,
      onValueEdit,
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
      editable,
      editableTrigger,
      showIcon,
    } = this;

    const {
      defaultFormatter,
      customFormatter,
      onNodeClick,
      onCheckedChange,
      onBracketsClickHandler,
      onValueEdit,
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

        <div class="vjs-indent">
          {Array.from(Array(node.level)).map((item, index) => (
            <div
              key={index}
              class={{
                'vjs-indent__unit': true,
                'has-line': showLine,
              }}
            />
          ))}
          {showIcon && <Carets nodeType={node.type} onClick={onBracketsClickHandler} />}
        </div>

        {node.key && <span class="vjs-key">{`${state.prettyKey}: `}</span>}

        <span>
          {node.type !== 'content' && node.content ? (
            <Brackets data={node.content.toString()} onClick={onBracketsClickHandler} />
          ) : customFormatter ? (
            <span class={state.valueClass} v-html={customFormatter(node.content)} />
          ) : (
            <span
              class={state.valueClass}
              onClick={
                editable && (!editableTrigger || editableTrigger === 'click')
                  ? onValueEdit
                  : undefined
              }
              onDblclick={editable && editableTrigger === 'dblclick' ? onValueEdit : undefined}
            >
              {defaultFormatter(node.content)}
            </span>
          )}

          {node.showComma && <span>{','}</span>}

          {showLength && collapsed && <span class="vjs-comment"> // {node.length} items </span>}
        </span>
      </div>
    );
  },
});
