<template>
  <div
    :class="{
      'vjs-tree': true,
      'has-selectable-control': isMultiple || showSelectController,
      'is-selectable': selectable,
      'is-selected': isSelected,
      'is-highlight-selected': isSelected && highlightSelectedNode,
      'is-mouseover': isMouseover
    }"
    @click="handleClick"
    @mouseover.stop="handleMouseover"
    @mouseout.stop="handleMouseout"
  >
    <template v-if="showSelectController && selectable">
      <vue-checkbox
        v-if="isMultiple"
        v-model="currentCheckboxVal"
        @change="handleValueChange('checkbox')"
      />
      <vue-radio
        v-else-if="isSingle"
        v-model="model"
        :path="path"
        @change="handleValueChange('radio')"
      />
    </template>

    <template v-if="Array.isArray(data) || isObject(data)">
      <!-- 左闭合 -->
      <!-- <brackets-left
        :visible.sync="visible"
        :data="data"
        :show-length="showLength"
        :collapsed-on-click-brackets="collapsedOnClickBrackets"
        :show-comma="notLastKey"
      >
        <span
          v-if="currentDeep > 1 && !Array.isArray(parentData)"
          class="vjs-key"
        >
          {{ prettyKey }}:
        </span>
      </brackets-left> -->

      <leaf
        v-for="(item, index) in flatData"
        :key="index"
        class="vjs-tree__content"
        :level="item.level"
        :path="item.path"
        :length="item.length"
        :collapsed="!!hiddenPaths[item.path]"
        :custom-value-formatter="customValueFormatter"
        :show-double-quotes="showDoubleQuotes"
        :show-comma="item.showComma"
        :show-length="showLength"
        :data="item.content"
        :current-key="item.key"
        :collapsed-on-click-brackets="collapsedOnClickBrackets"
        @brackets-click="onBracketsClick"
      />

      <!-- 数据内容, data 为对象时, key 表示键名, 为数组时表示索引 -->
      <!-- <div
        v-for="(item, key) in data"
        v-show="visible"
        :key="key"
        :class="{
          'vjs-tree__content': true,
          'has-line': showLine
        }"
      >
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
          :path="getChildPath(key)"
          :path-selectable="pathSelectable"
          :selectable-type="selectableType"
          :show-select-controller="showSelectController"
          :select-on-click-node="selectOnClickNode"
          :collapsed-on-click-brackets="collapsedOnClickBrackets"
          :current-key="key"
          :current-deep="currentDeep + 1"
          :custom-value-formatter="customValueFormatter"
          @click="handleItemClick"
          @change="handleItemChange"
        />
      </div> -->

      <!-- 右闭合 -->
      <!-- <brackets-right
        :visible.sync="visible"
        :data="data"
        :collapsed-on-click-brackets="collapsedOnClickBrackets"
        :show-comma="notLastKey"
      /> -->
    </template>
  </div>
</template>

<script>
  import Leaf from 'src/components/Leaf'
  import VueCheckbox from 'src/components/Checkbox'
  import VueRadio from 'src/components/Radio'
  import { getDataType, jsonFlat } from 'src/utils'
  import './styles.less'

  export default {
    name: 'VueJsonPretty',
    components: {
      Leaf,
      VueCheckbox,
      VueRadio,
    },
    props: {
      // 当前树的数据
      data: {
        type: [String, Number, Boolean, Array, Object],
        default: null
      },
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
      // collapsed control
      collapsedOnClickBrackets: {
        type: Boolean,
        default: true
      },
      // custom formatter for values
      customValueFormatter: {
        type: Function,
        default: null
      },
    },
    data () {
      return {
        isMouseover: false,
        currentCheckboxVal: Array.isArray(this.value) ? this.value.includes(this.path) : false,
        hiddenPaths: jsonFlat(this.data, this.path).reduce((acc, item) => {
          if ((item.content === '[' || item.content === '{') && item.level === this.deep) {
            return {
              ...acc,
              [item.path]: 1
            }
          }
          return acc
        }, {})
      }
    },
    computed: {
      flatData () {
        let startHiddenItem = null
        const data = jsonFlat(this.data, this.path).reduce((acc, item) => {
          const isHidden = this.hiddenPaths[item.path]
          if (startHiddenItem && startHiddenItem.path === item.path) {
            const mergeItem = {
              ...startHiddenItem,
              ...item,
              content: startHiddenItem.content === '{' ? '{...}' : '[...]'
            }
            startHiddenItem = null
            return acc.concat(mergeItem)
          } else if (isHidden && !startHiddenItem) {
            startHiddenItem = item
            return acc
          }

          return startHiddenItem ? acc : acc.concat(item)
        }, [])
        console.log(data);
        return data
      },

      model: {
        get () {
          const defaultVal = this.selectableType === 'multiple' ? [] : this.selectableType === 'single' ? '' : null
          return this.value || defaultVal
        },
        set (val) {
          this.$emit('input', val)
        }
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
    watch: {
      propsError: {
        handler (message) {
          if (message) {
            throw new Error(`[vue-json-pretty] ${message}`)
          }
        },
        immediate: true
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

      onBracketsClick (collapsed, path) {
        if (collapsed) {
          this.hiddenPaths = {
            ...this.hiddenPaths,
            [path]: 1
          }
        } else {
          const newPaths = {...this.hiddenPaths}
          delete newPaths[path]
          this.hiddenPaths = newPaths
        }
      }
    },
  }
</script>
