# vue-json-pretty

[![Build Status](https://travis-ci.org/leezng/vue-json-pretty.svg?branch=master)](https://travis-ci.org/leezng/vue-json-pretty)
[![npm package](https://img.shields.io/npm/v/vue-json-pretty.svg)](https://www.npmjs.org/package/vue-json-pretty)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/leezng/vue-json-pretty/blob/master/LICENSE)

A vue 2.x component for rendering JSON data as a tree structure.

- basic: JSON pretty
- advanced: get item data from JSON

## Links

- [Demo](https://leezng.github.io/vue-json-pretty)
- [Github](https://github.com/leezng/vue-json-pretty)
- [中文文档](./README.zh-CN.md)

## Install

```js
npm install vue-json-pretty
```

## Usage

```html
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
```

```js
import VueJsonPretty from 'vue-json-pretty'

export default {
  components: {
    VueJsonPretty
  }
}
```

## Props

- If you are using only the basic features (JSON pretty), just focus on the `base` properties.
- If you are using advanced features (get item data), you need to focus on the `base` and `advanced` attributes.

| Attribute | Level | Description | Type | Default |
|-------- |-------- |-------- | -------- |
| data | basic | json data | JSON object | - |
| deep | basic |data depth, data larger than this depth will not be expanded | number | Infinity |
| path | advanced | root data path | string | root |
| pathChecked | advanced | defines the selected data path | array | [] |
| pathSelectable | advanced | defines whether a data path supports selection | Function(itemPath, itemData) | - |
| selectableType | advanced | defines the selected type, this feature is not supported by default | enum: both, checkbox, tree | - |

## Events

- The following events are base on advanced features.

| Event Name | Description | Callback Parameters |
|---------- |-------- |---------- |
| click  | triggered when a data item is clicked | (path, data) |

