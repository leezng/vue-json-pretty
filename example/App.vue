<template>
  <div id="app" class="example-app">
    <div>
      <h2>JSON Tree:</h2>
      <vue-json-pretty :data="data" :path="'res'" @click="handleClick"></vue-json-pretty>
    </div>
    <div class="result">
      <h2>Click Result:</h2>
      <div>path: {{itemPath}}</div>
      <div>data: <pre>{{itemData}}</pre></div>
    </div>
  </div>
</template>

<script>
import VueJsonPretty from 'src/components/tree'

export default {
  name: 'app',
  components: {
    VueJsonPretty
  },
  data () {
    return {
      data: {
        a: 1,
        b: [{
          a: 1,
          b: 2
        }, {
          a: 'abcde',
          b: true
        }],
        c: {
          a: null,
          b: 2
        },
        d: 123456789
      },
      itemData: {},
      itemPath: ''
    }
  },
  methods: {
    handleClick (path, data) {
      this.itemPath = path
      this.itemData = !data ? data + '' : data // 处理 data = null 的情况
    }
  }
}
</script>

<style lang="less">
  html, body {
    margin: 0;
  }
  .example-app {
    > div {
      float: left;
      padding: 0 15px;
      width: 50%;
      min-height: 300px;
      box-sizing: border-box;
      &:first-child {
        border-right: 5px double #ccc;
      }
    }
    .result pre{
      margin: 0;
      font-family: Consolas;
    }
  }
</style>
