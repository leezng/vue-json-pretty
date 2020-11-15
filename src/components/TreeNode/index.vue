<template>
  <div
    :class="{
      'vjs-tree__node': true,
      'has-selector': showSelectController,
      'is-highlight': highlightSelectedNode && checked,
    }"
    @click="onTreeNodeClick"
  >
    <template
      v-if="
        showSelectController &&
          state.selectable &&
          node.type !== 'objectEnd' &&
          node.type !== 'arrayEnd'
      "
    >
      <check-controller
        :is-multiple="state.isMultiple"
        :checked="checked"
        @change="onCheckedChange"
      />
    </template>

    <div
      v-for="(item, index) in node.level"
      :key="index"
      :class="{
        'vjs-tree__indent': true,
        'has-line': showLine,
      }"
    />
    <span v-if="node.key" class="vjs-key"> {{ state.prettyKey }}:&nbsp; </span>

    <span>
      <brackets v-if="node.type !== 'content'" :data="node.content" @click="onBracketsClick" />

      <template v-else>
        <span
          v-if="customValueFormatter"
          :class="state.valueClass"
          v-html="customFormatter(node.content)"
        />
        <span v-else :class="state.valueClass">{{ defaultFormatter(node.content) }}</span>
      </template>

      <span v-if="node.showComma">,</span>

      <span v-if="showLength && collapsed" class="vjs-comment"> // {{ node.length }} items </span>
    </span>
  </div>
</template>

<script>
import { defineComponent, reactive, computed } from 'vue';
import Brackets from 'src/components/Brackets';
import CheckController from 'src/components/CheckController';
import { getDataType } from 'src/utils';
import './styles.less';

export default defineComponent({
  components: {
    Brackets,
    CheckController,
  },
  props: {
    node: {
      required: true,
      type: Object,
    },
    collapsed: Boolean,
    collapsedOnClickBrackets: Boolean,
    showDoubleQuotes: Boolean,
    showLength: Boolean,
    checked: Boolean,
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
    // custom formatter for values
    customValueFormatter: {
      type: Function,
      default: null,
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

    const defaultFormatter = data => {
      let text = data + '';
      if (dataType.value === 'string') text = `"${text}"`;
      return text;
    };

    const customFormatter = data => {
      return props.customValueFormatter
        ? props.customValueFormatter(data, props.node.key, props.node.path, defaultFormatter(data))
        : defaultFormatter(data);
    };

    const onBracketsClick = () => {
      if (props.collapsedOnClickBrackets) {
        emit('brackets-click', !props.collapsed, props.node.path);
      }
    };

    const onCheckedChange = () => {
      emit('selected-change', props.node);
    };

    const onTreeNodeClick = () => {
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
      onBracketsClick,
      onCheckedChange,
      onTreeNodeClick,
    };
  },
});
</script>
