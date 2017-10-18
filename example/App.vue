<template>
  <div id="app" class="example-app">
    <div>
      <h2>JSON Tree:</h2>
      <vue-json-pretty
        :data="data"
        :path="'res'"
        :path-checked="['res', 'res.c']"
        :path-selectable="pathSelectableFn"
        @click="handleClick">
      </vue-json-pretty>
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
      val: '',
      data: {
        a: 12,
        b: [[[{
          a: 1,
          b: 2
        }, {
          a: 'abcde',
          b: true
        }]]],
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
    handleClick (path, data, checked) {
      console.log('click', path, data, checked)
      this.itemPath = path
      this.itemData = !data ? data + '' : data // 处理 data = null 的情况
    },
    pathSelectableFn (path, data) {
      return !(Array.isArray(data) && data.some(item => Array.isArray(item)))
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
