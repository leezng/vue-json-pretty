// 获取数据类型
export function getDataType (value) {
  return Object.prototype.toString.call(value).slice(8, -1).toLowerCase()
}
