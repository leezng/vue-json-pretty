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

    <span v-if="showLineNumber" class="vjs-line-number">{{ lineNumber }}</span>

    <template v-if="Array.isArray(data) || isObject(data)">
      <!-- 左闭合 -->
      <brackets-left
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
          {{ keyFormatter(currentKey) }}:
        </span>
      </brackets-left>

      <!-- 数据内容, data 为对象时, key 表示键名, 为数组时表示索引 -->
      <div
        v-for="(item, key) in data"
        v-show="visible"
        :key="key"
        :class="{
          'vjs-tree__content': true,
          'has-line': showLine
        }"
      >
        <vue-json-pretty
          :ref="`vjs-${lineNumber}`"
          v-model="model"
          :parent-data="data"
          :data="item"
          :deep="deep"
          :show-length="showLength"
          :show-double-quotes="showDoubleQuotes"
          :show-line-number="showLineNumber"
          :show-line="showLine"
          :highlight-mouseover-node="highlightMouseoverNode"
          :highlight-selected-node="highlightSelectedNode"
          :path="path + (Array.isArray(data) ? `[${key}]` : `.${key}`)"
          :path-selectable="pathSelectable"
          :selectable-type="selectableType"
          :show-select-controller="showSelectController"
          :select-on-click-node="selectOnClickNode"
          :collapsed-on-click-brackets="collapsedOnClickBrackets"
          :current-key="key"
          :line-count="lineCount"
          :recursive-line-count="recursiveLineCount"
          :current-deep="currentDeep + 1"
          :custom-value-formatter="customValueFormatter"
          @click="handleItemClick"
          @change="handleItemChange"
        />
      </div>

      <span v-if="showLineNumber" class="vjs-line-number">{{ getRecursiveLineNumber() }}</span>

      <!-- 右闭合 -->
      <brackets-right
        :visible.sync="visible"
        :data="data"
        :collapsed-on-click-brackets="collapsedOnClickBrackets"
        :show-comma="notLastKey"
        v-on:rightBracketLoaded="handleRecursiveCount"
      />
    </template>

    <simple-text
      v-else
      :custom-value-formatter="customValueFormatter"
      :show-double-quotes="showDoubleQuotes"
      :show-comma="notLastKey"
      :parent-data="parentData"
      :data="data"
      :current-key="currentKey"
    >
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
    name: 'VueJsonPretty',
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
      showLineNumber: {
        type: Boolean,
        default: false
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
      /* outer props */

      /* inner props */
      // 当前树的父级数据
      parentData: {
        type: [String, Number, Boolean, Array, Object],
        default: null
      },
      // 当前树的深度, 以根节点作为0开始, 所以第一层树的深度为1, 递归逐次递增
      currentDeep: {
        type: Number,
        default: 1
      },
      // 当前树的数据 data 为数组时 currentKey 表示索引, 为对象时表示键名
      currentKey: {
        type: [Number, String],
        default: ''
      },
      // hold line count as items are added to the stack
      lineCount: {
        type: [Array],
        default: () => []
      },
      // hold line count for items popped off the stack
      recursiveLineCount: {
        type: [Array],
        default: () => []
      }
      /* outer props */
    },
    data () {
      return {
        visible: this.currentDeep <= this.deep,
        lineNumber: 1,
        previousLineNumber: 1,
        recursiveCount: 1,
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
        return ''
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
      },

      getRecursiveLineNumber () {
        if (this.lineNumber >= this.recursiveLineCount.length) {
          const diff = this.lineNumber - this.recursiveLineCount.length + 1
          for (let i = 0; i <= diff; i++) {
            this.recursiveLineCount.push('nl')
          }
        }

        if (this.lineNumber > this.recursiveCount) {
          return this.lineNumber + 1
        }

        return this.recursiveCount
      },

      handleRecursiveCount () {
        // iterate stack line count to stay up to date
        this.lineCount.push('nl')

        // grab most recent referenced element
        let el
        Object.keys(this.$refs).forEach((key) => {
          const last = this.$refs[key].length - 1
          el = this.$refs[key][last]
        })

        // assign most recent referenced line number for start of recursive count
        this.previousLineNumber = el.lineNumber + 1

        const diff = this.previousLineNumber - this.recursiveLineCount.length

        // handle edge case where json is one key and empty object
        if (diff === 0) {
          this.recursiveLineCount.push('nl')
        }

        // add recursive lines up to the previous one
        if (diff > 0) {
          for (let i = 0; i < diff; i++) {
            this.recursiveLineCount.push('nl')
          }
        }

        // assign new recursive count
        this.recursiveCount = this.recursiveLineCount.length

        // increment recursive count for multiple pops off the stack in a row
        this.recursiveLineCount.push('nl')
      }
    },
    // increment and assign stack line count
    created () {
      this.lineCount.push('nl')
      this.lineNumber = this.lineCount.length
    },
    // 捕获一个来自子组件的错误
    //    因为是递归组件，因此错误只对外暴露一次，子组件的错误不再对外传递
    errorCaptured () {
      return false
    }
  }
</script>
