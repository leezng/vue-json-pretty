<template>
  <span class="vjs-tree__brackets">
    {{ data }}
  </span>
</template>

<script>
import './styles.less';

export default {
  props: {
    data: {
      required: true,
      type: String,
    },
  },
};
</script>
