# vue-json-pretty

A Vue.js project for json-pretty. [leezng/vue-json-pretty](https://github.com/leezng/vue-json-pretty)

## Installation

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
| data | json data | string, array, object | - |
| path | root data path | string | root |

## Events

| Event Name | Description | Callback Parameters |
|---------- |-------- |---------- |
| click  | triggered when a data item is clicked | (path, data) |

