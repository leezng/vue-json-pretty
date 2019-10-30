<template>
  <span class="vjs-line-number">{{ number }}</span>
</template>

<script>
export default {
  props: {
    number: {
      type: Number,
      default: 0
    }
  }
}
</script>
