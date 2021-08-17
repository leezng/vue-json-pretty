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
<p>Now it supports Vue3 at least. If you still use Vue2, see <a href="https://github.com/leezng/vue-json-pretty/tree/1.x">1.x</a>.</p>

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
- Get item data from JSON.
- Written in TypeScript with predictable static types.
- Support big data.

## Environment Support

- Modern browsers, Electron and Internet Explorer 11 (with polyfills)
- Server-side Rendering

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Safari | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/electron/electron_48x48.png" alt="Electron" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Electron |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| IE11, Edge                                                                                                                                                                                                      | last 10 versions                                                                                                                                                                                                  | last 10 versions                                                                                                                                                                                              | last 10 versions                                                                                                                                                                                              | last 2 versions                                                                                                                                                                                                       |

## Using NPM or Yarn

```bash
$ npm install vue-json-pretty --save
```

```bash
$ yarn add vue-json-pretty
```

## Use Vue3

```bash
$ npm install vue-json-pretty@next --save
```

## Usage

The CSS file is included separately and needs to be imported manually. You can either import CSS globally in your app (if supported by your framework) or directly from the component.

```vue
<template>
  <div>
    <vue-json-pretty :path="'res'" :data="{ key: 'value' }" @click="handleClick"> </vue-json-pretty>
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

- If you are using only the normal features (JSON pretty), just focus on the `base` properties.
- If you are using higher features (Get data), you can use `base` and `higher` attributes.

| Attribute                | Level  | Description                                                                             | Type                                           | Default  |
| ------------------------ | ------ | --------------------------------------------------------------------------------------- | ---------------------------------------------- | -------- |
| data                     | normal | JSON data                                                                               | JSON object                                    | -        |
| deep                     | normal | Data depth, data larger than this depth will not be expanded                            | number                                         | Infinity |
| deepCollapseChildren     | normal | Whether children collapsed by `deep` prop should also be collapsed                      | boolean                                         | false |
| showLength               | normal | Whether to show the length when closed                                                  | boolean                                        | false    |
| showLine                 | normal | Whether to show the line                                                                | boolean                                        | true     |
| showDoubleQuotes         | normal | Whether to show doublequotes on key                                                     | boolean                                        | true     |
| virtual                  | normal | Whether to use virtual scrolling, usually used for big data                             | boolean                                        | false    |
| itemHeight               | normal | The height of each item when using virtual scrolling                                    | number                                         | auto     |
| v-model                  | higher | Defines value when the tree can be selected                                             | string, array                                  | -        |
| path                     | higher | Root data path                                                                          | string                                         | root     |
| pathSelectable           | higher | Defines whether a data path supports selection                                          | function(path, content)                        | -        |
| selectableType           | higher | Defines the selected type, this feature is not supported by default                     | multiple, single                               | -        |
| showSelectController     | higher | Whether to show the select controller at left                                           | boolean                                        | false    |
| selectOnClickNode        | higher | Whether to change selected value when click node                                        | boolean                                        | true     |
| highlightSelectedNode    | higher | Highlight current node when selected                                                    | boolean                                        | true     |
| collapsedOnClickBrackets | higher | Collapsed control                                                                       | boolean                                        | true     |
| customValueFormatter     | higher | A function that can return different html or strings to display for values in the data. | function(data, key, path, defaultFormatResult) | -        |

## Events

| Event Name | Description                                                                  | Callback Parameters |
| ---------- | ---------------------------------------------------------------------------- | ------------------- |
| click      | triggered when a data item is clicked                                        | (path, data)        |
| change     | triggered when the selected value changed (only the selectableType not null) | (newVal, oldVal)    |

## Major Contributors

[![](https://avatars3.githubusercontent.com/u/153197?v=3&s=50)](https://github.com/rchl)
[![](https://avatars1.githubusercontent.com/u/445616?v=3&s=50)](https://github.com/blackmad)
