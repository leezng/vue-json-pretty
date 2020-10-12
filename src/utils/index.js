// 获取数据类型
export function getDataType (value) {
  return Object.prototype.toString.call(value).slice(8, -1).toLowerCase()
}

export function jsonFlat(data, path = 'root', level = 0, { key, index, showComma = false, length = 1 } = {}) {
  if (typeof data === 'object') {
    if (Array.isArray(data)) {
      const inner = data
        .map((item, idx, arr) => jsonFlat(item, `${path}[${idx}]`, level + 1, {
          index: idx,
          showComma: idx !== arr.length - 1,
          length
        }))
        .flat();
      return [jsonFlat('[', path, level, { key, length: data.length })]
        .concat(inner, jsonFlat(']', path, level, { showComma, length: data.length }))
    } else {
      const keys = Object.keys(data);
      const inner = keys
        .map((objKey, idx, arr) =>
          jsonFlat(
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
      return [jsonFlat('{', path, level, { key, index, length: keys.length })]
        .concat(inner, jsonFlat('}', path, level, { showComma, length: keys.length }))
    }
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
