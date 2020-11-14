<template>
  <!-- click.stop 避免向上冒泡触发 tree.vue 的 click 事件-->
  <label :class="[`vjs-check-controller`, model ? 'is-checked' : '']" @click.stop>
    <span :class="`vjs-check-controller__inner is-${uiType}`" />
    <input
      v-model="model"
      :class="`vjs-check-controller__original is-${uiType}`"
      :type="uiType"
      @change="$emit('change', model)"
      @focus="focus = true"
      @blur="focus = false"
    />
  </label>
</template>

<script>
import { computed } from 'vue';
import './styles.less';

export default {
  emits: ['change', 'update:modelValue'],
  props: {
    checked: {
      type: Boolean,
      default: false,
    },
    isMultiple: Boolean,
  },
  data() {
    return {
      focus: false,
    };
  },
  setup(props, { emit }) {
    const uiType = computed(() => (props.isMultiple ? 'checkbox' : 'radio'));

    let model = computed({
      get: () => props.checked,
      set: (val) => emit('update:modelValue', val),
    });

    return {
      uiType,
      model,
    };
  },
};
</script>
