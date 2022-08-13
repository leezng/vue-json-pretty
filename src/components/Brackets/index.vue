<template>
  <span class="vjs-tree-brackets" @click.stop="toggleBrackets">{{ data }}</span>
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
  methods: {
    toggleBrackets(e) {
      this.$emit('click', e);
    },
  },
};
</script>
