# vue-json-pretty

一个基于 Vue.js 2.0 开发的 JSON 美化插件

- 基本功能: JSON 的美化
- 附加功能: JSON 数据对应层级数据的点击获取

## 链接

- [Demo](https://leezng.github.io/vue-json-pretty)
- [Github](https://github.com/leezng/vue-json-pretty)
- [English Document](./README.md)

## 安装

```js
npm install vue-json-pretty
```

## 快速开始

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

若仅使用 `JSON` 美化功能，只需传入 `data` 属性即可。

| 属性 | 说明 | 类型 | 默认值 |
|-------- |-------- |-------- | -------- |
| data | 待美化的源数据，注意不是 `JSON` 字符串 | `JSON` 对象 | - |
| path | 定义最顶层数据层级 | string | root |
| pathChecked | 定义哪些数据层级是已被选中的 | array | [] |
| pathSelectable | 定义哪些数据层级是可以被选中的 | Function(itemPath, itemData) | - |
| selectableType | 定义组件支持的选中方式，默认支持复选框选中与数据点击选中 | enum: both, checkbox, tree | both |

## Events

| 事件名 | 说明 | 回调参数 |
|---------- |-------- |---------- |
| click  | 点击某一个数据层级时触发的事件 | (path, data) |

