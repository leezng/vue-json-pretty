<template>
  <div class="vjs__tree">
    <brackets-left
      :visiable.sync="visiable"
      :data="data"
      :index="index"
      :last-index="lastIndex">
      <span v-if="child && !Array.isArray(json)">{{ index }}:</span>
    </brackets-left>

    <!-- data 为对象时, index 表示 key, 为数组才表示索引 -->
    <div
      v-for="(item, index) in data"
      v-show="visiable"
      class="vjs__tree__content"
      :style="{ 'background-color': treeContentBackground }"
      :key="index"
      @mouseover.stop="treeContentBackground = '#eee'"
      @mouseout.stop="treeContentBackground = 'transparent'"
      @click.stop="handleClick">
      <tree
        v-if="Array.isArray(item) || isObject(item)"
        :json="data"
        :data="item"
        :path="path + (Array.isArray(data) ? `[${index}]` : `.${index}`)"
        :index="index"
        :last-index="getLastIndex()"
        :child="true"
        @click="handleItemClick">
      </tree>

      <div v-else :class="{ 'vjs__not__lastIndex': index !== getLastIndex() }" >
        <span v-if="isObject(data)">{{ index }}:</span>
        <span :class="getValueClass(item)">{{ `${item}` }}</span>
      </div>
    </div>

    <brackets-right
      :visiable.sync="visiable"
      :data="data"
      :index="index"
      :last-index="lastIndex">
    </brackets-right>
  </div>
</template>

<script>
  import BracketsLeft from './brackets-left'
  import BracketsRight from './brackets-right'

  export default {
    name: 'tree',
    props: {
      /* 外部可用 START */
      data: {}, // 当前树的数据
      // 数据层级顶级路径
      path: {
        type: String,
        default: 'root'
      },
      /* 外部可用 END */
      json: {}, // 当前树的父级数据
      child: Boolean, // 是否子树
      index: {},
      lastIndex: {}
    },
    data () {
      return {
        visiable: true,
        treeContentBackground: 'transparent'
      }
    },
    components: {
      BracketsLeft,
      BracketsRight
    },
    methods: {
      // 触发组件的 click 事件
      handleClick () {
        this.$emit('click', this.path, this.data)
      },
      // 处理子树触发的 click 事件, 并传递到顶层
      handleItemClick (path, data) {
        this.$emit('click', path, data)
      },
      // 工具函数: 判断是否对象
      isObject (value) {
        return Object.prototype.toString.call(value).slice(8, -1).toLowerCase() === 'object'
      },
      // 获取当前 data 中最后一项的 key 或 索引, 便于界面判断是否添加 ","
      getLastIndex () {
        if (Array.isArray(this.data)) {
          return this.data.length - 1
        } else if (this.isObject(this.data)) {
          let arr = Object.keys(this.data)
          return arr[arr.length - 1]
        }
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
    .vjs__not__lastIndex:after {
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
