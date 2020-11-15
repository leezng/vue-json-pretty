<template>
  <span class="vjs-tree__brackets">
    {{ data }}
  </span>
</template>

<script>
import { defineComponent } from 'vue';
import './styles.less';

export default defineComponent({
  props: {
    data: {
      required: true,
      type: String,
    },
  },
});
</script>
