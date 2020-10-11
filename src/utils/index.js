// 获取数据类型
export function getDataType (value) {
  return Object.prototype.toString.call(value).slice(8, -1).toLowerCase()
}

export function jsonFlat(data, path = 'root', level = 0, key, index) {
  if (typeof data === 'object') {
    if (Array.isArray(data)) {
      const inner = data
        .map((item, index) => jsonFlat(item, `${path}[${index}]`, level + 1, undefined, index))
        .flat();
      return [jsonFlat('[', path, level, key)].concat(inner, jsonFlat(']', path, level))
    } else {
      const inner = Object.keys(data)
        .map((key) =>
          jsonFlat(
            data[key],
            key.includes('.') ? `${path}["${key}"]` : `${path}.${key}`,
            level + 1,
            key,
          ),
        )
        .flat();
      return [jsonFlat('{', path, level, key, index)].concat(inner, jsonFlat('}', path, level))
    }
  }

  return {
    content: data,
    level,
    key,
    index,
    path,
  };
}
