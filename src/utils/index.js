// 获取数据类型
export function getDataType (value) {
  // 若使用 typeof 会影响 webpack 压缩后体积变大
  return Object.prototype.toString.call(value).slice(8, -1).toLowerCase()
}
