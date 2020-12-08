import { defineComponent, PropType } from 'vue';
import './styles.less';

export default defineComponent({
  props: {
    data: {
      required: true,
      type: String,
    },
    onClick: Function as PropType<(e: MouseEvent) => void>,
  },

  render() {
    const { data } = this;

    const { onClick } = this;

    return (
      <span class="vjs-tree__brackets" onClick={onClick}>
        {data}
      </span>
    );
  },
});
