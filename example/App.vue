<template>
  <div class="example">
    <div class="example-box">
      <h2 class="title">EXAMPLE 1</h2>
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

    <div class="example-box">
      <h2 class="title">EXAMPLE 2</h2>
      <div class="block">
        <h3>JSON Input:</h3>
        <textarea v-model="val"></textarea>

        <h3>Latest Click Result:</h3>
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
    <a style="position: fixed; right: 0; top: 0;" href="https://github.com/leezng/el-form-renderer" target="_blank"><img style="position: absolute; top: 0; right: 0; border: 0;" src="https://camo.githubusercontent.com/652c5b9acfaddf3a9c326fa6bde407b87f7be0f4/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f72696768745f6f72616e67655f6666373630302e706e67" alt="Fork me on GitHub" data-canonical-src="https://s3.amazonaws.com/github/ribbons/forkme_right_orange_ff7600.png"></a>
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
    .title {
      text-align: center;
    }
    .block {
      float: left;
      padding: 0 15px;
      width: 50%;
      box-sizing: border-box;
    }
    textarea {
      padding: 5px;
      width: 100%;
      height: 150px;
      box-sizing: border-box;
      border-radius: 5px;
      resize: vertical;
      font-family: inherit;
      &:focus {
        outline: none;
        border-color: #1d8ce0;
        box-shadow: 0 0 3px #1d8ce0;
      }
    }
    pre{
      margin: 0;
      font-family: Consolas;
      overflow: auto;
      text-overflow: ellipsis;
    }
  }
</style>
