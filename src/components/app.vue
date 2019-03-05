<template>
  <div
    class="vjs__tree"
    :style="{
      'background-color': treeContentBackground,
      'position': currentDeep > 1 ? '' : 'relative',
      'margin-left': currentDeep === 1 && existCheckbox ? '30px' : ''
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
        :visible.sync="visible"
        :data="data"
        :show-length="showLength"
        :not-last-key="notLastKey">
        <span v-if="currentDeep > 1 && !Array.isArray(parentData)">{{ keyFormatter(currentKey) }}:</span>
      </brackets-left>

      <!-- 数据内容, data 为对象时, key 表示键名, 为数组时表示索引 -->
      <div
        v-for="(item, key) in data"
        v-show="visible"
        class="vjs__tree__content"
        :key="key">
        <vue-json-pretty
          :parent-data="data"
          :data="item"
          :deep="deep"
          :show-length="showLength"
          :show-double-quotes="showDoubleQuotes"
          :path="path + (Array.isArray(data) ? `[${key}]` : `.${key}`)"
          :path-checked="pathChecked"
          :path-selectable="pathSelectable"
          :selectable-type="selectableType"
          :current-key="key"
          :current-deep="currentDeep + 1"
          @click="handleItemClick">
        </vue-json-pretty>
      </div>

      <!-- 右闭合 -->
      <brackets-right
        :visible.sync="visible"
        :data="data"
        :not-last-key="notLastKey">
      </brackets-right>
    </template>

    <simple-text
      v-else
      :show-double-quotes="showDoubleQuotes"
      :parent-data-type="getDataType(parentData)"
      :data-type="getDataType(data)"
      :text="data + ''"
      :not-last-key="notLastKey"
      :currentKey="currentKey">
    </simple-text>
  </div>
</template>

<script>
  import SimpleText from './simple-text'
  import Checkbox from './checkbox'
  import BracketsLeft from './brackets-left'
  import BracketsRight from './brackets-right'

  export default {
    name: 'vue-json-pretty',
    components: {
      SimpleText,
      Checkbox,
      BracketsLeft,
      BracketsRight
    },
    props: {
      /* 外部可用 START */
      // 当前树的数据
      data: {},
      // 定义树的深度, 大于该深度的子树将不被展开
      deep: {
        type: Number,
        default: Infinity
      },
      // 是否显示数组|对象的长度
      showLength: {
        type: Boolean,
        default: false
      },
      // key名是否显示双引号
      showDoubleQuotes: {
        type: Boolean,
        default: true
      },
      // 数据层级顶级路径
      path: {
        type: String,
        default: 'root'
      },
      // 定义数据层级支持的选中方式, 默认无该功能
      selectableType: {
        type: String,
        default: '' // both, checkbox, tree
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
      /* 外部可用 END */

      /* 内部递归使用 */
      // 当前树的父级数据
      parentData: {},
      // 当前树的深度, 以根节点作为0开始, 所以第一层树的深度为1, 递归逐次递增
      currentDeep: {
        type: Number,
        default: 1
      },
      // 当前树的数据 data 为数组时 currentKey 表示索引, 为对象时表示键名
      currentKey: [Number, String]
    },
    data () {
      return {
        visible: this.currentDeep <= this.deep,
        treeContentBackground: 'transparent',
        checkboxVal: this.pathChecked.includes(this.path) // 复选框的值
      }
    },
    computed: {
      // 获取当前 data 中最后一项的 key 或 索引, 便于界面判断是否添加 ","
      lastKey () {
        if (Array.isArray(this.parentData)) {
          return this.parentData.length - 1
        } else if (this.isObject(this.parentData)) {
          let arr = Object.keys(this.parentData)
          return arr[arr.length - 1]
        }
      },
      // 是否不是最后一项
      notLastKey () {
        return this.currentKey !== this.lastKey
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
      // 是否对象
      isObject (value) {
        return this.getDataType(value) === 'object'
      },
      // 获取数据类型
      getDataType (value) {
        // 若使用 typeof 会影响 webpack 压缩后体积变大
        return Object.prototype.toString.call(value).slice(8, -1).toLowerCase()
      },
      keyFormatter (key) {
        return this.showDoubleQuotes ? `"${key}"` : key
      }
    },
    watch: {
      deep (newVal) {
        this.visible = this.currentDeep <= newVal
      }
    }
  }
</script>
