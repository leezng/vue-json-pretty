// 获取数据类型
export function getDataType (value) {
  return Object.prototype.toString.call(value).slice(8, -1).toLowerCase()
}

export function jsonFlatten(data, path = 'root', level = 0, { key, index, showComma = false, length = 1 } = {}) {
  const dataType = getDataType(data)
  if (dataType === 'array') {
    const inner = data
      .map((item, idx, arr) => jsonFlatten(item, `${path}[${idx}]`, level + 1, {
        index: idx,
        showComma: idx !== arr.length - 1,
        length
      }))
      .flat();
    return [jsonFlatten('[', path, level, { key, length: data.length })]
      .concat(inner, jsonFlatten(']', path, level, { showComma, length: data.length }))
  } else if (dataType === 'object') {
    const keys = Object.keys(data);
    const inner = keys
      .map((objKey, idx, arr) =>
        jsonFlatten(
          data[objKey],
          objKey.includes('.') ? `${path}["${objKey}"]` : `${path}.${objKey}`,
          level + 1,
          {
            key: objKey,
            showComma: idx !== arr.length - 1,
            length
          },
        ),
      )
      .flat();
    return [jsonFlatten('{', path, level, { key, index, length: keys.length })]
      .concat(inner, jsonFlatten('}', path, level, { showComma, length: keys.length }))
  }

  // return {
  //   content: data,
  //   level,
  //   key,
  //   index,
  //   path,
  //   showComma,
  //   length,
  // }
  // objectStart objectEnd objectCollapsed
  return Object.entries({
    content: data,
    level,
    key,
    index,
    path,
    showComma,
    length,
  }).reduce((acc, [key, value]) => {
    if (value !== undefined) {
      return {
        ...acc,
        [key]: value
      }
    }
    return acc;
  }, {});
}
