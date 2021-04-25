简体中文 | [English](./README.md)

## 特性

- 一个 JSON 美化工具
- 提取字段层级数据
- 支持大数据虚拟滚动

## Props

- 若仅使用基础功能(JSON 美化)，只需关注功能级别为 `基础` 的属性。
- 若使用高级功能(选择数据)，你可以同时使用 `基础` 与 `高级` 的属性。

| 属性                     | 级别 | 说明                                      | 类型                                           | 默认值        |
| ------------------------ | ---- | ----------------------------------------- | ---------------------------------------------- | ------------- |
| data                     | 基础 | 待美化的源数据，注意不是 `JSON` 字符串    | `JSON` 对象                                    | -             |
| deep                     | 基础 | 数据深度, 大于该深度的数据将不被展开      | number                                         | Infinity      |
| showLength               | 基础 | 是否在数据线闭合的时候展示长度            | boolean                                        | false         |
| showLine                 | 基础 | 是否显示缩紧标识线                        | boolean                                        | true          |
| showDoubleQuotes         | 基础 | 是否展示 key 名的双引号                   | boolean                                        | true          |
| virtual                  | 基础 | 是否使用虚拟滚动(大数据量时)              | boolean                                        | false         |
| itemHeight               | 基础 | 使用虚拟滚动时，定义每一行高度            | number                                         | auto          |
| v-model                  | 高级 | 双向绑定选中的数据层级                    | string, array                                  | string, array |
| path                     | 高级 | 定义最顶层数据层级                        | string                                         | root          |
| pathSelectable           | 高级 | 定义哪些数据层级是可以被选中的            | function(path, content)                        | -             |
| selectableType           | 高级 | 定义组件支持的选中方式，默认无选中功能    | multiple, single                               | -             |
| showSelectController     | 高级 | 是否展示选择控制器                        | boolean                                        | false         |
| selectOnClickNode        | 高级 | 是否在点击节点的时候触发 v-model 双向绑定 | boolean                                        | true          |
| highlightSelectedNode    | 高级 | 是否高亮已选项                            | boolean                                        | true          |
| collapsedOnClickBrackets | 高级 | 是否支持折叠                              | boolean                                        | true          |
| customValueFormatter     | 高级 | 可以进行值的自定义渲染                    | function(data, key, path, defaultFormatResult) | -             |

## Events

| 事件名 | 说明                                   | 回调参数         |
| ------ | -------------------------------------- | ---------------- |
| click  | 点击某一个数据层级时触发的事件         | (path, data)     |
| change | v-model 改变的事件(仅在选择模式下可用) | (newVal, oldVal) |
