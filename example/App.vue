<template>
  <div class="example">
    <div class="example-box">
      <h2 class="title">
        EXAMPLE 1
      </h2>
      <div class="block">
        <h3>JSON:</h3>
        <textarea v-model="val" />

        <h3>Options:</h3>
        <div class="options">
          <div>
            <label>showLength</label>
            <input
              v-model="showLength"
              type="checkbox"
            >
          </div>
          <div>
            <label>showLine</label>
            <input
              v-model="showLine"
              type="checkbox"
            >
          </div>
          <div>
            <label>showDoubleQuotes</label>
            <input
              v-model="showDoubleQuotes"
              type="checkbox"
            >
          </div>
          <div>
            <label>highlightMouseoverNode</label>
            <input
              v-model="highlightMouseoverNode"
              type="checkbox"
            >
          </div>
          <div>
            <label>collapsedOnClickBrackets</label>
            <input
              v-model="collapsedOnClickBrackets"
              type="checkbox"
            >
          </div>
          <div>
            <label>use custom formatter</label>
            <input
              v-model="useCustomLinkFormatter"
              type="checkbox"
            >
          </div>
          <div>
            <label>deep</label>
            <select v-model="deep">
              <option :value="2">
                2
              </option>
              <option :value="3">
                3
              </option>
              <option :value="4">
                4
              </option>
            </select>
          </div>
        </div>
      </div>
      <div class="block">
        <h3>vue-json-pretty:</h3>
        <vue-json-pretty
          :data="data"
          :deep="deep"
          :show-double-quotes="showDoubleQuotes"
          :show-length="showLength"
          :show-line="showLine"
          :highlight-mouseover-node="highlightMouseoverNode"
          :collapsed-on-click-brackets="collapsedOnClickBrackets"
          :custom-value-formatter="useCustomLinkFormatter ? customLinkFormatter : null"
          @click="handleClick"
        />
      </div>
    </div>

    <div class="example-box">
      <h2 class="title">
        EXAMPLE 2
      </h2>
      <div class="block">
        <h3>JSON:</h3>
        <textarea v-model="val" />

        <h3>Options:</h3>
        <div class="options">
          <div>
            <label>selectableType</label>
            <select v-model="selectableType">
              <option label="-" />
              <option>single</option>
              <option>multiple</option>
            </select>
          </div>
          <div>
            <label>showSelectController</label>
            <input
              v-model="showSelectController"
              type="checkbox"
            >
          </div>
          <div>
            <label>selectOnClickNode</label>
            <input
              v-model="selectOnClickNode"
              type="checkbox"
            >
          </div>
          <div>
            <label>path</label>
            <input
              v-model="path"
              type="text"
            >
          </div>
          <div>
            <label>showLength</label>
            <input
              v-model="showLength"
              type="checkbox"
            >
          </div>
          <div>
            <label>showLine</label>
            <input
              v-model="showLine"
              type="checkbox"
            >
          </div>
          <div>
            <label>showDoubleQuotes</label>
            <input
              v-model="showDoubleQuotes"
              type="checkbox"
            >
          </div>
          <div>
            <label>highlightMouseoverNode</label>
            <input
              v-model="highlightMouseoverNode"
              type="checkbox"
            >
          </div>
          <div>
            <label>highlightSelectedNode</label>
            <input
              v-model="highlightSelectedNode"
              type="checkbox"
            >
          </div>
          <div>
            <label>collapsedOnClickBrackets</label>
            <input
              v-model="collapsedOnClickBrackets"
              type="checkbox"
            >
          </div>
          <div>
            <label>deep</label>
            <select v-model="deep">
              <option :value="2">
                2
              </option>
              <option :value="3">
                3
              </option>
              <option :value="4">
                4
              </option>
            </select>
          </div>
          <div>
            <label>use custom formatter</label>
            <input
              v-model="useCustomLinkFormatter"
              type="checkbox"
            >
          </div>
        </div>
        <h3>v-model:</h3>
        <div>{{ value }}</div>
        <h3>Current Click:</h3>
        <div>path: {{ itemPath }}</div>
        <div>data: <pre>{{ itemData }}</pre></div>
      </div>
      <div class="block">
        <h3>vue-json-pretty:</h3>
        <vue-json-pretty
          v-if="renderOK"
          v-model="value"
          :data="data"
          :path="path"
          :deep="deep"
          :show-double-quotes="showDoubleQuotes"
          :highlight-mouseover-node="highlightMouseoverNode"
          :highlight-selected-node="highlightSelectedNode"
          :show-length="showLength"
          :show-line="showLine"
          :select-on-click-node="selectOnClickNode"
          :collapsed-on-click-brackets="collapsedOnClickBrackets"
          :path-selectable="((path, data) => typeof data !== 'number')"
          :selectable-type="selectableType"
          :show-select-controller="showSelectController"
          :custom-value-formatter="useCustomLinkFormatter ? customLinkFormatter : null"
          @click="handleClick(...arguments, 'complexTree')"
          @change="handleChange"
        />
      </div>
    </div>
    <a
      style="position: fixed; right: 0; top: 0;"
      href="https://github.com/leezng/vue-json-pretty"
      target="_blank"
    ><img
      style="position: absolute; top: 0; right: 0; border: 0;"
      src="https://camo.githubusercontent.com/652c5b9acfaddf3a9c326fa6bde407b87f7be0f4/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f72696768745f6f72616e67655f6666373630302e706e67"
      alt="Fork me on GitHub"
      data-canonical-src="https://s3.amazonaws.com/github/ribbons/forkme_right_orange_ff7600.png"
    ></a>
  </div>
</template>

<script>
import VueJsonPretty from 'src'

const defaultData = {
  status: 200,
  error: '',
  data: [{
    news_id: 51184,
    title: 'iPhone X Review: Innovative future with real black technology',
    source: 'Netease phone'
  }, {
    news_id: 51183,
    title: 'Traffic paradise: How to design streets for people and unmanned vehicles in the future?',
    source: 'Netease smart',
    link: 'http://netease.smart/traffic-paradise/1235'
  }, {
    news_id: 51182,
    title: 'Teslamask\'s American Business Relations: The government does not pay billions to build factories',
    source: 'AI Finance',
    members: ['Daniel', 'Mike', 'John']
  }]
}

export default {
  name: 'App',
  components: {
    VueJsonPretty
  },
  data () {
    return {
      renderOK: true,
      val: JSON.stringify(defaultData),
      data: defaultData,
      value: 'res.error',
      selectableType: 'single',
      showSelectController: true,
      showLength: false,
      showLine: true,
      showDoubleQuotes: true,
      highlightMouseoverNode: true,
      highlightSelectedNode: true,
      selectOnClickNode: true,
      collapsedOnClickBrackets: true,
      useCustomLinkFormatter: false,
      path: 'res',
      deep: 3,
      itemData: {},
      itemPath: '',
    }
  },
  watch: {
    val(newVal) {
      try {
        this.data = JSON.parse(this.val)
      } catch (err) {
        console.log('JSON ERROR')
      }
    },
    selectableType (newVal) {
      this.renderOK = false
      if (newVal === 'single') {
        this.value = 'res.error'
      } else if (newVal === 'multiple') {
        this.value = ['res.error', 'res.data[0].title']
      }
      // 重新渲染, 因为2中情况的v-model格式不同
      this.$nextTick(() => {
        this.renderOK = true
      })
    }
  },
  methods: {
    handleClick (path, data, treeName = '') {
      console.log('click: ', path, data, treeName)
      this.itemPath = path
      this.itemData = !data ? data + '' : data // 处理 data = null 的情况
    },
    handleChange (newVal, oldVal) {
      console.log('newVal: ', newVal, ' oldVal: ', oldVal)
    },
    customLinkFormatter (data, key, parent, defaultFormatted) {
      if (data.startsWith('http://')) {
        return `<a style="color:red;" href="${data}" target="_blank">"${data}"</a>`;
      } else {
        return defaultFormatted;
      }
    }
  }
}
</script>

<style lang="less">
  html, body {
    margin: 0;
    background-color: #f9f9f9;
  }
  .example {
    position: relative;
    padding: 0 15px;
    margin: 0 auto;
    width: 1200px;
  }
  .example-box {
    margin: 0 -15px;
    overflow: hidden;
    h3 {
      display: inline-block;
    }
    .title {
      text-align: center;
    }
    .block {
      float: left;
      padding: 0 15px;
      width: 50%;
      box-sizing: border-box;
    }
    input,
    select,
    textarea {
      padding: 3px 8px;
      box-sizing: border-box;
      border-radius: 5px;
      border: 1px solid #bbb;
      font-family: inherit;
      &:focus {
        outline: none;
        border-color: #1d8ce0;
        box-shadow: 0 0 3px #1d8ce0;
      }
    }
    textarea {
      width: 100%;
      height: 150px;
      resize: vertical;
    }
    pre {
      margin: 0;
      font-family: Consolas;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .options {
      font-size: 14px;
    }
  }
</style>
