import { defineComponent, computed, PropType } from 'vue';
import './styles.less';

export default defineComponent({
  emits: ['change', 'update:modelValue'],

  props: {
    checked: {
      type: Boolean,
      default: false,
    },
    isMultiple: Boolean,
    onChange: Function as PropType<(state: boolean) => void>,
  },

  setup(props, { emit }) {
    const uiType = computed(() => (props.isMultiple ? 'checkbox' : 'radio'));

    const model = computed({
      get: (): boolean => props.checked,
      set: val => emit('update:modelValue', val),
    });

    return {
      uiType,
      model,
    };
  },

  render() {
    const { uiType, model, $emit } = this;

    return (
      <label
        class={[`vjs-check-controller`, model ? 'is-checked' : '']}
        onClick={e => e.stopPropagation()}
      >
        <span class={`vjs-check-controller__inner is-${uiType}`} />
        <input
          checked={model}
          class={`vjs-check-controller__original is-${uiType}`}
          type={uiType}
          onChange={() => $emit('change', model)}
        />
      </label>
    );
  },
});
