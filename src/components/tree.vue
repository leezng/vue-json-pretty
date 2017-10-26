<template>
  <div
    class="vjs__tree"
    :style="{
      'background-color': treeContentBackground,
      'position': child ? '' : 'relative',
      'margin-left': !child && existCheckbox ? '30px' : ''
    }"
    @click.stop="handleClick($event)"
    @mouseover.stop="handleMouseover"
    @mouseout.stop="handleMouseout">

    <template v-if="selectable && existCheckbox" class="vjs-checkbox">
      <checkbox v-model="checkboxVal" @change="handleClick($event, true)"></checkbox>
    </template>

    <template v-if="Array.isArray(data) || isObject(data)">
      <!-- 左闭合 -->
      <brackets-left
        :visiable.sync="visiable"
        :data="data"
        :index="index"
        :last-index="lastIndex">
        <span v-if="child && !Array.isArray(parentData)">{{ index }}:</span>
      </brackets-left>

      <!-- 数据内容, data 为对象时, index 表示 key, 为数组才表示索引 -->
      <div
        v-for="(item, index) in data"
        v-show="visiable"
        class="vjs__tree__content"
        :key="index">
        <tree
          :parent-data="data"
          :data="item"
          :path="path + (Array.isArray(data) ? `[${index}]` : `.${index}`)"
          :path-checked="pathChecked"
          :path-selectable="pathSelectable"
          :selectable-type="selectableType"
          :index="index"
          :child="true"
          @click="handleItemClick">
        </tree>
      </div>

      <!-- 右闭合 -->
      <brackets-right
        :visiable.sync="visiable"
        :data="data"
        :index="index"
        :last-index="lastIndex">
      </brackets-right>
    </template>

    <template v-else>
      <div :class="{ 'vjs__not__lastIndex': index !== lastIndex }">
        <span v-if="isObject(parentData)">{{ index }}:</span>
        <!-- data 可能为 null, 因此界面展示转为字符串 -->
        <span :class="getValueClass(data)">{{ data + '' }}</span>
      </div>
    </template>
  </div>
</template>

<script>
  import Checkbox from './checkbox'
  import BracketsLeft from './brackets-left'
  import BracketsRight from './brackets-right'

  export default {
    name: 'tree',
    components: {
      Checkbox,
      BracketsLeft,
      BracketsRight
    },
    props: {
      /* 外部可用 START */
      data: {}, // 当前树的数据
      // 数据层级顶级路径
      path: {
        type: String,
        default: 'root'
      },
      // 定义已选中的数据层级
      pathChecked: {
        type: Array,
        default: () => []
      },
      // 定义某个数据层级是否支持选中操作
      pathSelectable: {
        type: Function,
        default: () => true
      },
      // 定义数据层级支持的选中方式, 默认所有方式均支持
      selectableType: {
        type: String,
        default: 'both' // both, checkbox, tree
      },
      /* 外部可用 END */
      parentData: {}, // 当前树的父级数据
      child: Boolean, // 是否子树(优化: 通过 $parent?)
      index: {}
    },
    data () {
      return {
        visiable: true,
        treeContentBackground: 'transparent',
        checkboxVal: this.pathChecked.includes(this.path) // 复选框的值
      }
    },
    computed: {
      // 获取当前 data 中最后一项的 key 或 索引, 便于界面判断是否添加 ","
      lastIndex () {
        if (Array.isArray(this.parentData)) {
          return this.parentData.length - 1
        } else if (this.isObject(this.parentData)) {
          let arr = Object.keys(this.parentData)
          return arr[arr.length - 1]
        }
      },
      // 当前的树是否支持选中功能
      selectable () {
        return this.pathSelectable(this.path, this.data)
      },
      // 存在复选框
      existCheckbox () {
        return this.selectableType === 'both' || this.selectableType === 'checkbox'
      },
      // 存在mouseover
      existMouseover () {
        return this.selectableType === 'both' || this.selectableType === 'tree'
      }
    },
    methods: {
      /**
       * 触发组件的 click 事件
       * @param  {Boolean} changed 复选框值是否已改变(如果来自复选框 change 事件则已改变)
       */
      handleClick (e, changed = false) {
        // 由于 checkbox 也依赖该函数, 因此通过 changed 进行排除
        if (!changed && !this.existMouseover || !this.selectable) return
        changed || (this.checkboxVal = !this.checkboxVal)
        this.$emit('click', this.path, this.data, this.checkboxVal)
      },
      // 处理子树触发的 click 事件, 并传递到顶层
      handleItemClick (path, data, checked) {
        this.$emit('click', path, data, checked)
      },
      handleMouseover () {
        this.existMouseover && this.selectable && (this.treeContentBackground = '#eee')
      },
      handleMouseout () {
        this.existMouseover && this.selectable && (this.treeContentBackground = 'transparent')
      },
      // 工具函数: 判断是否对象
      isObject (value) {
        return Object.prototype.toString.call(value).slice(8, -1).toLowerCase() === 'object'
      },
      // 简单类型数据添加 class, 定义样式
      getValueClass (value) {
        if (value === null) {
          // null
          return 'vjs__value__null'
        } else {
          // string, number, boolean
          return `vjs__value__${typeof value}`
        }
      }
    }
  }
</script>

<style lang="less">
  @content-padding: 15px; /* 树的内容区域左留空*/

  .vjs__tree {
    font-family: "Monaco", "Menlo", "Consolas", "Bitstream Vera Sans Mono";
    line-height: 1.5;
    .vjs__tree__content {
      padding-left: @content-padding;
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
    .vjs-checkbox {
      position: absolute;
      left: -30px;
    }
    .vjs__value__null {
      font-weight: bold;
      color: #ff4949;
    }
    .vjs__value__number,
    .vjs__value__boolean {
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
