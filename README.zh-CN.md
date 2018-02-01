# vue-json-pretty

[![Build Status](https://travis-ci.org/leezng/vue-json-pretty.svg?branch=master)](https://travis-ci.org/leezng/vue-json-pretty)
[![npm package](https://img.shields.io/npm/v/vue-json-pretty.svg)](https://www.npmjs.org/package/vue-json-pretty)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/leezng/vue-json-pretty/blob/master/LICENSE)

一个将 JSON 字符串渲染成树形结构的 Vue2.x 组件

- 基础功能: JSON 的美化
- 高级功能: JSON 数据对应层级数据的获取

## 链接

- [Demo](https://leezng.github.io/vue-json-pretty)
- [Github](https://github.com/leezng/vue-json-pretty)
- [English Document](./README.md)

## 安装

```js
npm install vue-json-pretty -save
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

- 若仅使用基础功能(JSON美化)，只需关注功能级别为 `基础` 的属性。
- 若使用高级功能(数据层级的获取)，需关注 `基础` 与 `高级` 的属性。

| 属性 | 功能级别 | 说明 | 类型 | 默认值 |
|-------- |-------- |-------- |-------- | -------- |
| data | 基础 | 待美化的源数据，注意不是 `JSON` 字符串 | `JSON` 对象 | - |
| deep | 基础 | 数据深度, 大于该深度的数据将不被展开 | number | Infinity |
| path | 高级 | 定义最顶层数据层级 | string | root |
| pathChecked | 高级 | 定义哪些数据层级是已被选中的 | array | [] |
| pathSelectable | 高级 | 定义哪些数据层级是可以被选中的 | Function(itemPath, itemData) | - |
| selectableType | 高级 | 定义组件支持的选中方式，默认无选中功能 | enum: both, checkbox, tree | - |

## Events

- 若使用高级功能，下列事件才是有效的。

| 事件名 | 说明 | 回调参数 |
|---------- |-------- |---------- |
| click  | 点击某一个数据层级时触发的事件 | (path, data) |

