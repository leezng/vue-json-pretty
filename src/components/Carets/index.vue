<template>
  <span
    v-if="isOpen || isClose"
    :class="`vjs-carets vjs-carets-${isOpen ? 'open' : 'close'}`"
    @click="handleClick"
  >
    <svg
      viewBox="0 0 1024 1024"
      focusable="false"
      data-icon="caret-down"
      width="1em"
      height="1em"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        d="M840.4 300H183.6c-19.7 0-30.7 20.8-18.5 35l328.4 380.8c9.4 10.9 27.5 10.9 37 0L858.9 335c12.2-14.2 1.2-35-18.5-35z"
      ></path>
    </svg>
  </span>
</template>

<script>
import './styles.less';

export default {
  props: {
    nodeType: {
      type: String,
      required: true,
    },
  },
  computed: {
    isOpen() {
      return this.nodeType === 'objectStart' || this.nodeType === 'arrayStart';
    },

    isClose() {
      return this.nodeType === 'objectCollapsed' || this.nodeType === 'arrayCollapsed';
    },
  },
  methods: {
    handleClick() {
      this.$emit('click');
    },
  },
};
</script>
