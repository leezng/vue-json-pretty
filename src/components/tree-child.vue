<template>
  <div>
    <div>
      <span v-if="!isArray(data)">{{ index }}:</span>
      <span v-show="show" class="vjs__tree__node" @click.stop="toggle">
        {{ isArray(item) ? '[' : '{' }}
      </span>
      <span v-show="!show" class="vjs__tree__node" @click.stop="toggle" :class="{ 'vjs__lastIndex': index !== lastIndex }">
        <span>{{ isArray(item) ? '[...]' : '{...}' }}</span>
      </span>
    </div>

    <div v-show="show">
      <slot></slot>
    </div>

    <div v-show="show">
      <span :class="{ 'vjs__tree__node': true, 'vjs__lastIndex': index !== lastIndex }"
      @click.stop="toggle">{{ isArray(item) ? ']' : '}' }}</span>
    </div>
  </div>
</template>

<script>
  import mixin from 'src/mixins/mixin'

  export default {
    mixins: [mixin],
    props: {
      data: {
        required: true
      },
      item: {
        required: true
      },
      index: {
        required: true,
        type: [Number, String]
      }
    }
  }
</script>
