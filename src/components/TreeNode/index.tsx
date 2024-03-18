import { defineComponent, reactive, computed, PropType, CSSProperties } from 'vue';
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
  // Custom render for key.
  renderNodeKey: Function as PropType<
    (opt: { node: NodeDataType; defaultKey: string | JSX.Element }) => unknown
  >,
  // Custom render for value.
  renderNodeValue: Function as PropType<
    (opt: { node: NodeDataType; defaultValue: string | JSX.Element }) => unknown
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
    type: Function as PropType<(node: NodeDataType) => boolean>,
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
  theme: {
    type: String as PropType<'light' | 'dark'>,
    default: 'light',
  },
  showKeyValueSpace: {
    type: Boolean,
    default: true,
  },
  editable: {
    type: Boolean,
    default: false,
  },
  editableTrigger: {
    type: String as PropType<'click' | 'dblclick'>,
    default: 'click',
  },
  onNodeClick: {
    type: Function as PropType<(node: NodeDataType) => void>,
  },
  onBracketsClick: {
    type: Function as PropType<(collapsed: boolean, node: NodeDataType) => void>,
  },
  onIconClick: {
    type: Function as PropType<(collapsed: boolean, node: NodeDataType) => void>,
  },
  onValueChange: {
    type: Function as PropType<(value: boolean, path: string) => void>,
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
    style: Object as PropType<CSSProperties>,
    onSelectedChange: {
      type: Function as PropType<(node: NodeDataType) => void>,
    },
  },

  emits: ['nodeClick', 'bracketsClick', 'iconClick', 'selectedChange', 'valueChange'],

  setup(props, { emit }) {
    const dataType = computed<string>(() => getDataType(props.node.content));

    const valueClass = computed(() => `vjs-value vjs-value-${dataType.value}`);

    const prettyKey = computed(() =>
      props.showDoubleQuotes ? `"${props.node.key}"` : props.node.key,
    );

    const renderKey = () => {
      const render = props.renderNodeKey;

      return render
        ? render({ node: props.node, defaultKey: prettyKey.value || '' })
        : prettyKey.value;
    };

    const isMultiple = computed(() => props.selectableType === 'multiple');

    const isSingle = computed(() => props.selectableType === 'single');

    // Whether the current node supports the selected function.
    const selectable = computed(
      () => props.nodeSelectable(props.node) && (isMultiple.value || isSingle.value),
    );

    const state = reactive({
      editing: false,
    });

    const handleInputChange = (e: Event) => {
      const source = (e.target as HTMLInputElement)?.value;
      const value = stringToAutoType(source);
      emit('valueChange', value, props.node.path);
    };

    const defaultValue = computed(() => {
      let value = props.node?.content;
      if (value === null) {
        value = 'null';
      } else if (value === undefined) {
        value = 'undefined';
      }
      return dataType.value === 'string' ? `"${value}"` : value + '';
    });

    const renderValue = () => {
      const render = props.renderNodeValue;

      return render
        ? render({ node: props.node, defaultValue: defaultValue.value })
        : defaultValue.value;
    };

    const handleBracketsClick = () => {
      emit('bracketsClick', !props.collapsed, props.node);
    };

    const handleIconClick = () => {
      emit('iconClick', !props.collapsed, props.node);
    };

    const handleSelectedChange = () => {
      emit('selectedChange', props.node);
    };

    const handleNodeClick = () => {
      emit('nodeClick', props.node);
      if (selectable.value && props.selectOnClickNode) {
        emit('selectedChange', props.node);
      }
    };

    const handleValueEdit = (e: MouseEvent) => {
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

    return () => {
      const { node } = props;

      return (
        <div
          class={{
            'vjs-tree-node': true,
            'has-selector': props.showSelectController,
            'has-carets': props.showIcon,
            'is-highlight': props.highlightSelectedNode && props.checked,
            dark: props.theme === 'dark',
          }}
          onClick={handleNodeClick}
          style={props.style}
        >
          {props.showLineNumber && <span class="vjs-node-index">{node.id + 1}</span>}

          {props.showSelectController &&
            selectable.value &&
            node.type !== 'objectEnd' &&
            node.type !== 'arrayEnd' && (
              <CheckController
                isMultiple={isMultiple.value}
                checked={props.checked}
                onChange={handleSelectedChange}
              />
            )}

          <div class="vjs-indent">
            {Array.from(Array(node.level)).map((item, index) => (
              <div
                key={index}
                class={{
                  'vjs-indent-unit': true,
                  'has-line': props.showLine,
                }}
              />
            ))}
            {props.showIcon && <Carets nodeType={node.type} onClick={handleIconClick} />}
          </div>

          {node.key && (
            <span class="vjs-key">
              {renderKey()}
              <span class="vjs-colon">{`:${props.showKeyValueSpace ? ' ' : ''}`}</span>
            </span>
          )}

          <span>
            {node.type !== 'content' && node.content ? (
              <Brackets data={node.content.toString()} onClick={handleBracketsClick} />
            ) : (
              <span
                class={valueClass.value}
                onClick={
                  props.editable && (!props.editableTrigger || props.editableTrigger === 'click')
                    ? handleValueEdit
                    : undefined
                }
                onDblclick={
                  props.editable && props.editableTrigger === 'dblclick'
                    ? handleValueEdit
                    : undefined
                }
              >
                {props.editable && state.editing ? (
                  <input
                    value={defaultValue.value}
                    onChange={handleInputChange}
                    style={{
                      padding: '3px 8px',
                      border: '1px solid #eee',
                      boxShadow: 'none',
                      boxSizing: 'border-box',
                      borderRadius: 5,
                      fontFamily: 'inherit',
                    }}
                  />
                ) : (
                  renderValue()
                )}
              </span>
            )}

            {node.showComma && <span>{','}</span>}

            {props.showLength && props.collapsed && (
              <span class="vjs-comment"> // {node.length} items </span>
            )}
          </span>
        </div>
      );
    };
  },
});
