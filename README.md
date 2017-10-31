# vue-json-pretty

A Vue.js 2.0 Toolkit for JSON.

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

| Attribute | Description | Type | Default |
|-------- |-------- |-------- | -------- |
| data | json data | JSON object | - |
| path | root data path | string | root |
| pathChecked | defines the selected data path | array | [] |
| pathSelectable | defines whether a data path supports selection | Function(itemPath, itemData) | - |
| selectableType | defines the selected type, by default all types are supported | enum: both, checkbox, tree | both |

## Events

| Event Name | Description | Callback Parameters |
|---------- |-------- |---------- |
| click  | triggered when a data item is clicked | (path, data) |

