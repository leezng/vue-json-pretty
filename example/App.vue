<template>
  <div id="app" class="example-app">
    <div class="block">
      <h2>JSON Input:</h2>
      <textarea v-model="val"></textarea>

      <h2>Click Result:</h2>
      <div>path: {{itemPath}}</div>
      <div>data: <pre>{{itemData}}</pre></div>
    </div>
    <div class="block">
      <h2>JSON Tree:</h2>
      <vue-json-pretty
        :data="json"
        :path="'res'"
        :path-checked="['res', 'res.c']"
        :path-selectable="pathSelectableFn"
        @click="handleClick">
      </vue-json-pretty>
    </div>
  </div>
</template>

<script>
import VueJsonPretty from 'src'

export default {
  name: 'app',
  components: {
    VueJsonPretty
  },
  data () {
    return {
      val: '',
      data: {
        status: 200,
        error: '',
        data: [{
          news_id: '51184',
          title: '行货iPhone X评测：用真正黑科技革新未来',
          source: '网易手机'
        },{
          news_id: '51183',
          title: '交通天堂：未来城市如何为人与无人车设计街道？',
          source: '网易智能'
        },{
          news_id: '51182',
          title: '特斯拉马斯克的美国政商关系：政府不掏一百亿不建厂',
          source: 'AI财经社'
        }]
      },
      itemData: {},
      itemPath: ''
    }
  },
  created () {
    this.val = JSON.stringify(this.data)
  },
  computed: {
    json () {
      try {
        this.cache = JSON.parse(this.val)
        return this.cache
      } catch (err) {
        return this.cache || this.data
      }
    }
  },
  methods: {
    handleClick (path, data, checked) {
      console.log('click', path, data, checked)
      this.itemPath = path
      this.itemData = !data ? data + '' : data // 处理 data = null 的情况
    },
    pathSelectableFn (path, data) {
      // return !(Array.isArray(data) && data.some(item => Array.isArray(item)))
      return true
    }
  }
}
</script>

<style lang="less">
  html, body {
    margin: 0;
  }
  h2 {
    margin: 0 0 10px;
  }
  .example-app {
    padding: 10px;
    overflow: hidden;
    .block {
      float: left;
      padding: 0 20px;
      width: 50%;
      box-sizing: border-box;
      textarea {
        padding: 5px;
        width: 100%;
        height: 100px;
        box-sizing: border-box;
      }
      pre{
        margin: 0;
        font-family: Consolas;
      }
    }
  }
</style>
