<template>
  <div class="vjs__tree">
    <span v-if="!child && show" class="vjs__tree__node" @click="toggle">{{ isArray(json) ? '[' : '{' }}</span>
    <span v-show="!show" class="vjs__tree__node" @click.stop="toggle">
      {{ isArray(json) ? '[...]' : '{...}' }}
    </span>

    <div
      v-for="(item, index) in json"
      v-show="show"
      class="vjs__tree__content"
      :style="{ 'background-color': treeContentBackground }"
      :key="index"
      @mouseover.stop="treeContentBackground = '#eee'"
      @mouseout.stop="treeContentBackground = 'transparent'"
      @click.stop="getItemData">
      <tree-child
        v-if="isArray(item) || isObject(item)"
        :index="index"
        :data="json"
        :item="item">
        <tree
          :data="item"
          :child="true"
          :path="path + (isArray(json) ? `[${index}]` : `.${index}`)">
        </tree>
      </tree-child>

      <div v-else :class="{ 'vjs__lastIndex': index !== lastIndex }" >
        <span v-if="isObject(json)">{{ index }}:</span>
        <span :class="getValueClass(item)">{{ `${item}` }}</span>
      </div>
    </div>

    <span v-if="!child && show" class="vjs__tree__node" @click.stop="toggle">
      {{ isArray(json) ? ']' : '}' }}
    </span>
  </div>
</template>

<script>
  import TreeChild from './tree-child'
  import mixin from 'src/mixins/mixin'

  export default {
    name: 'tree',
    mixins: [mixin],
    props: {
      data: {},
      child: Boolean,
      path: {
        type: String,
        default: 'res'
      }
    },
    data () {
      return {
        treeContentBackground: 'transparent'
      }
    },
    components: {
      TreeChild
    },
    computed: {
      json () {
        return JSON.parse(JSON.stringify(this.data))
      }
    },
    methods: {
      getItemData () {
        console.log('path: ', this.path)
        console.log('data: ', this.json)
      },
      getValueClass (value) {
        if (value === null) {
          return 'vjs__value__null'
        } else if (typeof value === 'number') {
          return 'vjs__value__number'
        } else if (typeof value === 'string') {
          return 'vjs__value__string'
        }
      }
    }
  }
</script>

<style lang="less">
  .vjs__tree {
    font-family: "Monaco", "Menlo", "Consolas", "Bitstream Vera Sans Mono";
    .vjs__tree__content {
      padding-left: 15px;
      border-left: 1px dotted #ccc;
    }
    .vjs__tree__node {
      cursor: pointer;
      &:hover {
        color: #20a0ff;
      }
    }
    .vjs__lastIndex:after {
      content: ",";
    }
    .vjs__value__null {
      font-weight: bold;
      color: #ff4949;
    }
    .vjs__value__number {
      font-weight: bold;
      color: #1d8ce0;
    }
    .vjs__value__string {
      color: #13ce66;
      &:before,
      &:after {
        content: "\""
      }
    }
  }
</style>
