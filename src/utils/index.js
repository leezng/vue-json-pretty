// 获取数据类型
export function getDataType (value) {
  return Object.prototype.toString.call(value).slice(8, -1).toLowerCase()
}

export function jsonFlat(data, path = 'root', level = 0, { key, index, showComma = false } = {}) {
  if (typeof data === 'object') {
    if (Array.isArray(data)) {
      const inner = data
        .map((item, idx, arr) => jsonFlat(item, `${path}[${idx}]`, level + 1, {
          index: idx,
          showComma: idx !== arr.length - 1
        }))
        .flat();
      return [jsonFlat('[', path, level, {key})].concat(inner, jsonFlat(']', path, level, { showComma }))
    } else {
      const inner = Object.keys(data)
        .map((objKey, idx, arr) =>
          jsonFlat(
            data[objKey],
            objKey.includes('.') ? `${path}["${objKey}"]` : `${path}.${objKey}`,
            level + 1,
            {
              key: objKey,
              showComma: idx !== arr.length - 1
            },
          ),
        )
        .flat();
      return [jsonFlat('{', path, level, {key, index})].concat(inner, jsonFlat('}', path, level, { showComma }))
    }
  }

  return {
    content: data,
    level,
    key,
    index,
    path,
    showComma,
  };
}
