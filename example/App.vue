<template>
  <div id="app">
    <div class="example example-1">
      <h2>EXAMPLE 1</h2>
      <div class="block">
        <h3>JSON Input:</h3>
        <textarea v-model="val"></textarea>
      </div>
      <div class="block">
        <h3>JSON Tree:</h3>
        <vue-json-pretty
          :data="json"
          :path="'res'">
        </vue-json-pretty>
      </div>
    </div>

    <div class="example example-2">
      <h2>EXAMPLE 2</h2>
      <div class="block">
        <h3>JSON Input:</h3>
        <textarea v-model="val"></textarea>

        <h3>Click Result:</h3>
        <div>path: {{itemPath}}</div>
        <div>data: <pre>{{itemData}}</pre></div>
      </div>
      <div class="block">
        <h3>JSON Tree:</h3>
        <vue-json-pretty
          :data="json"
          :path="'res'"
          :path-checked="['res', 'res.c']"
          :path-selectable="pathSelectableFn"
          :selectable-type="'both'"
          @click="handleClick">
        </vue-json-pretty>
      </div>
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
          news_id: 51184,
          title: 'iPhone X Review: Innovative future with real black technology',
          source: 'Netease phone'
        }, {
          news_id: 51183,
          title: 'Traffic paradise: How to design streets for people and unmanned vehicles in the future?',
          source: 'Netease smart'
        }, {
          news_id: 51182,
          title: 'Teslamask\'s American Business Relations: The government does not pay billions to build factories',
          source: 'AI Finance'
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
  h2, h3 {
    margin: 0 0 10px;
  }
  .example {
    padding: 10px;
    overflow: hidden;
    .block {
      float: left;
      padding: 0 20px;
      width: 50%;
      box-sizing: border-box;
    }
    textarea {
      padding: 5px;
      width: 100%;
      height: 100px;
      box-sizing: border-box;
      font-family: inherit;
    }
    pre{
      margin: 0;
      font-family: Consolas;
    }
  }
</style>
