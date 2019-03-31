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
- [NPM](https://www.npmjs.com/package/vue-json-pretty)
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
// 更多用法请见demo页面
import VueJsonPretty from 'vue-json-pretty'

export default {
  components: {
    VueJsonPretty
  }
}
```

## Props

- 若仅使用基础功能(JSON美化)，只需关注功能级别为 `基础` 的属性。
- 若使用高级功能(选择数据)，你可以同时使用 `基础` 与 `高级` 的属性。

| 属性 | 级别 | 说明 | 类型 | 默认值 |
|-------- |-------- |-------- |-------- | -------- |
| data | 基础 | 待美化的源数据，注意不是 `JSON` 字符串 | `JSON` 对象 | - |
| deep | 基础 | 数据深度, 大于该深度的数据将不被展开 | number | Infinity |
| showLength | 基础 | 是否在数据线闭合的时候展示长度 | boolean | false |
| showLine | 基础 | 是否显示缩紧标识线 | boolean | true |
| showDoubleQuotes | 基础 | 是否展示key名的双引号 | boolean | true |
| highlightMouseoverNode | 基础 | 是否在mouseover的时候高亮 | boolean | false |
| v-model | 高级 | 双向绑定选中的数据层级 | string, array | -, [] |
| path | 高级 | 定义最顶层数据层级 | string | root |
| pathChecked | 高级 | 定义哪些数据层级是已被选中的 | array | [] |
| pathSelectable | 高级 | 定义哪些数据层级是可以被选中的 | Function(itemPath, itemData) | - |
| selectableType | 高级 | 定义组件支持的选中方式，默认无选中功能 | enum: -, multiple, single | - |
| showSelectController | 高级 | 是否展示选择控制器 | boolean | false |
| selectOnClickNode | 高级 | 是否在点击节点的时候触发v-model双向绑定 | boolean | true |
| highlightSelectedNode | 高级 | 是否高亮已选项 | boolean | true |

## Events

| 事件名 | 说明 | 回调参数 |
|---------- |-------- |---------- |
| click  | 点击某一个数据层级时触发的事件 | (path, data) |
| change  | v-model改变的事件(仅在选择模式下可用) | (newVal, oldVal) |
