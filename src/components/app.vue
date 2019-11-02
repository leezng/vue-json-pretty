<template>
  <div
    :class="{
      'vjs-tree': true,
      'has-selectable-control': isMultiple || showSelectController,
      'is-root': currentDeep === 1,
      'is-selectable': selectable,
      'is-selected': isSelected,
      'is-highlight-selected': isSelected && highlightSelectedNode,
      'is-mouseover': isMouseover
    }"
    @click="handleClick"
    @mouseover.stop="handleMouseover"
    @mouseout.stop="handleMouseout">
    <template v-if="showSelectController && selectable">
      <vue-checkbox v-if="isMultiple" v-model="currentCheckboxVal" @change="handleValueChange('checkbox')"></vue-checkbox>
      <vue-radio v-else-if="isSingle" v-model="model" @change="handleValueChange('radio')" :path="path"></vue-radio>
    </template>

    <template v-if="Array.isArray(data) || isObject(data)">
      <!-- 左闭合 -->
      <brackets-left
        :visible.sync="visible"
        :data="data"
        :show-length="showLength"
        :show-comma="notLastKey"
        :collapse-brackets.sync="collapseBrackets">
        <span v-if="currentDeep > 1 && !Array.isArray(parentData)" class="vjs-key">{{ keyFormatter(currentKey) }}:</span>
      </brackets-left>

      <!-- 数据内容, data 为对象时, key 表示键名, 为数组时表示索引 -->
      <div
        v-for="(item, key) in data"
        v-show="visible"
        :class="{
          'vjs-tree__content': true,
          'has-line': showLine
        }"
        :key="key">
        <vue-json-pretty
          v-model="model"
          :parent-data="data"
          :data="item"
          :deep="deep"
          :show-length="showLength"
          :show-double-quotes="showDoubleQuotes"
          :show-line="showLine"
          :highlight-mouseover-node="highlightMouseoverNode"
          :highlight-selected-node="highlightSelectedNode"
          :collapse-brackets.sync="collapseBrackets"
          :path="path + (Array.isArray(data) ? `[${key}]` : `.${key}`)"
          :path-selectable="pathSelectable"
          :selectable-type="selectableType"
          :show-select-controller="showSelectController"
          :select-on-click-node="selectOnClickNode"
          :current-key="key"
          :current-deep="currentDeep + 1"
          @click="handleItemClick"
          @change="handleItemChange">
        </vue-json-pretty>
      </div>

      <!-- 右闭合 -->
      <brackets-right
        :visible.sync="visible"
        :data="data"
        :show-comma="notLastKey"
        :collapse-brackets.sync="collapseBrackets">
      </brackets-right>
    </template>

    <simple-text
      v-else
      :show-double-quotes="showDoubleQuotes"
      :show-comma="notLastKey"
      :parent-data="parentData"
      :data="data"
      :current-key="currentKey">
      <span
        v-if="parentData && currentKey && !Array.isArray(parentData)"
        class="vjs-key"
      >
        {{ keyFormatter(currentKey) }}:
      </span>
    </simple-text>
  </div>
</template>

<script>
  import SimpleText from './simple-text'
  import VueCheckbox from './checkbox'
  import VueRadio from './radio'
  import BracketsLeft from './brackets-left'
  import BracketsRight from './brackets-right'
  import { getDataType } from 'src/utils'

  export default {
    name: 'vue-json-pretty',
    components: {
      SimpleText,
      VueCheckbox,
      VueRadio,
      BracketsLeft,
      BracketsRight
    },
    props: {
      /* outer props */
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
        default: '' // ''|multiple|single    radio, checkbox
      },
      // 是否展示左侧选择控件
      showSelectController: {
        type: Boolean,
        default: false
      },
      showLine: {
        type: Boolean,
        default: true
      },
      // 是否在点击树的时候选中节点
      selectOnClickNode: {
        type: Boolean,
        default: true
      },
      // 存在选择功能时, 定义已选中的数据层级
      //    多选时为数组['root.a', 'root.b'], 单选时为字符串'root.a'
      value: {
        type: [Array, String],
        default: () => ''
      },
      // 定义某个数据层级是否支持选中操作
      pathSelectable: {
        type: Function,
        default: () => true
      },
      // highlight current node when mouseover
      highlightMouseoverNode: {
        type: Boolean,
        default: false
      },
      // highlight current node when selected
      highlightSelectedNode: {
        type: Boolean,
        default: true
      },
      // restrict the brackets to collapse when clicked
      collapseBrackets: {
        type: Boolean,
        default: true
      },
      /* outer props */

      /* inner props */
      // 当前树的父级数据
      parentData: {},
      // 当前树的深度, 以根节点作为0开始, 所以第一层树的深度为1, 递归逐次递增
      currentDeep: {
        type: Number,
        default: 1
      },
      // 当前树的数据 data 为数组时 currentKey 表示索引, 为对象时表示键名
      currentKey: [Number, String]
      /* outer props */
    },
    data () {
      return {
        visible: this.currentDeep <= this.deep,
        isMouseover: false,
        currentCheckboxVal: Array.isArray(this.value) ? this.value.includes(this.path) : false
      }
    },
    computed: {
      model: {
        get () {
          const defaultVal = this.selectableType === 'multiple' ? [] : this.selectableType === 'single' ? '' : null
          return this.value || defaultVal
        },
        set (val) {
          this.$emit('input', val)
        }
      },

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
        return this.pathSelectable(this.path, this.data) && (this.isMultiple || this.isSingle)
      },

      // 多选模式
      isMultiple () {
        return this.selectableType === 'multiple'
      },

      // 单选模式
      isSingle () {
        return this.selectableType === 'single'
      },

      isSelected () {
        if (this.isMultiple) {
          return this.model.includes(this.path)
        } else if (this.isSingle) {
          return this.model === this.path
        } else {
          return false
        }
      },

      propsError () {
        const error = this.selectableType && !this.selectOnClickNode && !this.showSelectController
        return error ? 'When selectableType is not null, selectOnClickNode and showSelectController cannot be false at the same time, because this will cause the selection to fail.' : ''
      }
    },
    methods: {
      handleValueChange (emitType) {
        if (this.isMultiple && (emitType === 'checkbox' || emitType === 'tree')) {
          // handle multiple
          const index = this.model.findIndex(item => item === this.path)
          const oldVal = [...this.model]
          if (index !== -1) {
            this.model.splice(index, 1)
          } else {
            this.model.push(this.path)
          }

          if (emitType !== 'checkbox') {
            this.currentCheckboxVal = !this.currentCheckboxVal
          }
          this.$emit('change', this.model, oldVal)
        } else if (this.isSingle && (emitType === 'radio' || emitType === 'tree')) {
          // handle single
          if (this.model !== this.path) {
            const oldVal = this.model
            const newVal = this.path
            this.model = newVal
            this.$emit('change', newVal, oldVal)
          }
        }
      },

      /**
       * emit click event
       * @param  {string} emitType tree/checkbox/radio
       */
      handleClick (e) {
        // Event can not be stopPropagation, because user may be listening the click event.
        // So use _uid to simulated.
        if (e._uid && e._uid !== this._uid) return
        e._uid = this._uid

        this.$emit('click', this.path, this.data)
        if (this.selectable && this.selectOnClickNode) {
          this.handleValueChange('tree')
        }
      },

      // handle children's click, and propagation
      handleItemClick (path, data) {
        this.$emit('click', path, data)
      },

      // handle children's change, and propagation
      handleItemChange (newVal, oldVal) {
        // 可选的时候change事件才有意义
        if (this.selectable) {
          this.$emit('change', newVal, oldVal)
        }
      },

      handleMouseover () {
        // 可选择的树|普通展示树, 都支持mouseover
        this.highlightMouseoverNode && (this.selectable || this.selectableType === '') && (this.isMouseover = true)
      },

      handleMouseout () {
        this.highlightMouseoverNode && (this.selectable || this.selectableType === '') && (this.isMouseover = false)
      },

      // 是否对象
      isObject (value) {
        return getDataType(value) === 'object'
      },

      keyFormatter (key) {
        return this.showDoubleQuotes ? `"${key}"` : key
      }
    },
    // 捕获一个来自子组件的错误
    //    因为是递归组件，因此错误只对外暴露一次，子组件的错误不再对外传递
    errorCaptured () {
      return false
    },
    watch: {
      deep (newVal) {
        this.visible = this.currentDeep <= newVal
      },
      propsError: {
        handler (message) {
          if (message) {
            throw new Error(`[vue-json-pretty] ${message}`)
          }
        },
        immediate: true
      }
    }
  }
</script>
