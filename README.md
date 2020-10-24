# vue-json-pretty

[![Build Status](https://travis-ci.org/leezng/vue-json-pretty.svg?branch=master)](https://travis-ci.org/leezng/vue-json-pretty)
[![npm package](https://img.shields.io/npm/v/vue-json-pretty.svg)](https://www.npmjs.org/package/vue-json-pretty)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/leezng/vue-json-pretty/blob/master/LICENSE)

A vue 2.x component for rendering JSON data as a tree structure.

- As a JSON Formatter
- Get item data from JSON

## Links

- [Demo](https://leezng.github.io/vue-json-pretty)
- [Github](https://github.com/leezng/vue-json-pretty)
- [NPM](https://www.npmjs.com/package/vue-json-pretty)
- [中文文档](./README.zh-CN.md)

## Install

```bash
npm install vue-json-pretty --save
```

## Usage

The CSS file is included separately and needs to be imported manually. You can either import CSS globally in your app (if supported by your framework) or directly from the component.

```vue
<template>
  <div>
    ...
    <vue-json-pretty
      :path="'res'"
      :data="{ key: 'value' }"
      @click="handleClick">
    </vue-json-pretty>
  </div>
</template>

<script>
import VueJsonPretty from 'vue-json-pretty'
import 'vue-json-pretty/lib/styles.css'

export default {
  components: {
    VueJsonPretty
  }
}
</script>
```

## Nuxt.js

1. In `plugins/vue-json-pretty.js`

```
import Vue from 'vue'
import VueJsonPretty from 'vue-json-pretty'

Vue.component("vue-json-pretty", VueJsonPretty)
```

2. In `nuxt.config.js`

```js
css: [
  'vue-json-pretty/lib/styles.css'
],
plugins: [
  '@/plugins/vue-json-pretty'
],
```

## Props

- If you are using only the normal features (JSON pretty), just focus on the `base` properties.
- If you are using higher features (Get data), you can use `base` and `higher` attributes.

| Attribute | Level | Description | Type | Default |
|-------- |-------- |-------- |-------- | -------- |
| data | normal | json data | JSON object | - |
| deep | normal | data depth, data larger than this depth will not be expanded | number | Infinity |
| showLength | normal | whether to show the length when closed | boolean | false |
| showLine | normal | whether to show the line | boolean | true |
| showDoubleQuotes | normal | whether to show doublequotes on key | boolean | true |
| highlightMouseoverNode | normal | highlight current node when mouseover | boolean | false |
| v-model | higher | defines value when the tree can be selected | string, array | -, [] |
| path | higher | root data path | string | root |
| pathChecked | higher | defines the selected data path | array | [] |
| pathSelectable | higher | defines whether a data path supports selection | Function(itemPath, itemData) | - |
| selectableType | higher | defines the selected type, this feature is not supported by default | enum: -, multiple, single  | - |
| showSelectController | higher | whether to show the select controller at left | boolean | false |
| selectOnClickNode | higher | whether to change selected value when click node | boolean | true |
| highlightSelectedNode | higher | highlight current node when selected | boolean | true |
| collapsedOnClickBrackets | higher | collapsed control | boolean | true |
| customValueFormatter | higher | a function that can return different html or strings to display for values in the data. | Function(data, key, parent, defaultFormatted) | - |

## Events

| Event Name | Description | Callback Parameters |
|---------- |-------- |---------- |
| click  | triggered when a data item is clicked | (path, data) |
| change  | triggered when the selected value changed (only the selectableType not null) | (newVal, oldVal) |

## Major Contributors

[![](https://avatars3.githubusercontent.com/u/153197?v=3&s=50)](https://github.com/rchl)
[![](https://avatars1.githubusercontent.com/u/445616?v=3&s=50)](https://github.com/blackmad)
