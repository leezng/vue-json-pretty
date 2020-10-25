<template>
  <div class="example">
    <div class="example-box">
      <h2 class="title">
        Basic Use
      </h2>
      <basic />
    </div>

    <div class="example-box">
      <h2 class="title">
        Virtual List
      </h2>
      <virtual-list />
    </div>

    <div class="example-box">
      <h2 class="title">
        Selecter
      </h2>
      <select-control />
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
import Basic from './Basic'
import VirtualList from './VirtualList'
import SelectControl from './SelectControl'

export default {
  name: 'App',
  components: {
    Basic,
    VirtualList,
    SelectControl,
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
