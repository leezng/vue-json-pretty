<p align="center">
  <a href="https://github.com/leezng/vue-json-pretty">
    <img width="200" src="./static/logo.svg">
  </a>
</p>

<h1 align="center">
  <a href="https://github.com/leezng/vue-json-pretty" target="_blank">Vue Json Pretty</a>
</h1>

<div align="center">

<p>A Vue component for rendering JSON data as a tree structure.</p>
<p>Use Vue2, see <a href="https://github.com/leezng/vue-json-pretty/tree/1.x">1.x</a>.</p>
<p>Use Vue3, see <a href="https://github.com/leezng/vue-json-pretty/tree/master">master</a>.</p>

[![Build Status](https://travis-ci.org/leezng/vue-json-pretty.svg?branch=master)](https://travis-ci.org/leezng/vue-json-pretty)
[![npm package](https://img.shields.io/npm/v/vue-json-pretty.svg)](https://www.npmjs.org/package/vue-json-pretty)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/leezng/vue-json-pretty/blob/master/LICENSE)
[![Sizes](https://img.shields.io/bundlephobia/min/vue-json-pretty)](https://bundlephobia.com/result?p=vue-json-pretty)
[![NPM downloads](http://img.shields.io/npm/dm/vue-json-pretty.svg?style=flat-square)](https://www.npmtrends.com/vue-json-pretty)
[![Issues](https://img.shields.io/github/issues-raw/leezng/vue-json-pretty)](https://github.com/leezng/vue-json-pretty/issues)

</div>

[![](./static/screenshot.png)](https://github.com/leezng/vue-json-pretty)

English | [简体中文](./README.zh_CN.md)

## Features

- As a JSON Formatter.
- Support get item data from JSON.
- Support big data.
- Support editable.

## Environment Support

- Modern browsers, Electron and Internet Explorer 11 (with polyfills)
- Server-side Rendering

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Safari | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/electron/electron_48x48.png" alt="Electron" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Electron |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| IE11, Edge                                                                                                                                                                                                      | last 10 versions                                                                                                                                                                                                  | last 10 versions                                                                                                                                                                                              | last 10 versions                                                                                                                                                                                              | last 2 versions                                                                                                                                                                                                       |

## Using NPM or Yarn

```bash
$ npm install vue-json-pretty@v1-latest --save
```

```bash
$ yarn add vue-json-pretty@v1-latest
```

## Use Vue3

```bash
$ npm install vue-json-pretty --save
```

## Usage

The CSS file is included separately and needs to be imported manually. You can either import CSS globally in your app (if supported by your framework) or directly from the component.

```vue
<template>
  <div>
    <vue-json-pretty :data="{ key: 'value' }" />
  </div>
</template>

<script>
import VueJsonPretty from 'vue-json-pretty';
import 'vue-json-pretty/lib/styles.css';

export default {
  components: {
    VueJsonPretty,
  },
};
</script>
```

## Use Nuxt.js

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

| Property                 | Description                                     | Type                 | Default |
| ------------------------ | ----------------------------------------------- | -------------------- | ------- |
| data(v-model)            | JSON data, support v-model when use editable    | JSON object          | -       |
| deep                     | Paths greater than this depth will be collapsed | number               | -       |
| showLength               | Show the length when collapsed                  | boolean              | false   |
| showLine                 | Show the line                                   | boolean              | true    |
| showLineNumber           | Show the line number                            | boolean              | false   |
| showIcon                 | Show the icon                                   | boolean              | false   |
| showDoubleQuotes         | Show doublequotes on key                        | boolean              | true    |
| virtual                  | Use virtual scroll                              | boolean              | false   |
| height                   | The height of list when using virtual           | number               | 400     |
| itemHeight               | The height of node when using virtual           | number               | 20      |
| selectedValue.sync       | Selected data path                              | string, array        | -       |
| rootPath                 | Root data path                                  | string               | `root`  |
| nodeSelectable           | Defines whether a data path supports selection  | function(node)       | -       |
| selectableType           | Support path select, default none               | `multiple`, `single` | -       |
| showSelectController     | Show the select controller                      | boolean              | false   |
| selectOnClickNode        | Trigger select when click node                  | boolean              | true    |
| highlightSelectedNode    | Support highlighting selected nodes             | boolean              | true    |
| collapsedOnClickBrackets | Support click brackets to collapse              | boolean              | true    |
| editable                 | Support editable                                | boolean              | false   |
| editableTrigger          | Trigger                                         | `click`, `dblclick`  | `click` |

## Events

| Event Name      | Description                              | Parameters           |
| --------------- | ---------------------------------------- | -------------------- |
| node-click      | triggers when click node                 | (node: NodeData)     |
| brackets-click  | triggers when click brackets             | (collapsed: boolean) |
| icon-click      | triggers when click icon                 | (collapsed: boolean) |
| selected-change | triggers when the selected value changed | (newVal, oldVal)     |

## Slots

| Slot Name | Description       | Parameters             |
| --------- | ----------------- | ---------------------- |
| nodeKey | render node key | { node, defaultKey } |
| nodeValue | render node value | { node, defaultValue } |

## Contributors

<a href="https://github.com/leezng/vue-json-pretty/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=leezng/vue-json-pretty" />
</a>
