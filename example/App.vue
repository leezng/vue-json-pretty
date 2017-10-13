<template>
  <div id="app" class="example-app">
    <vue-json-pretty :data="data" :path="'res'" @click="handleClick"></vue-json-pretty>
    <div class="result">
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
        }
      },
      itemData: {},
      itemPath: ''
    }
  },
  methods: {
    handleClick (path, data) {
      this.itemPath = path
      this.itemData = data
    }
  }
}
</script>

<style lang="less">
  .example-app {
    padding: 30px;
    > div {
      float: left;
      padding: 15px;
      width: 50%;
      min-height: 300px;
      border: 1px solid #ccc;
      box-sizing: border-box;
    }
    .result {
      font-family: Consolas;
      pre {
        margin: 0;
        font-family: inherit;
      }
    }
  }
</style>
