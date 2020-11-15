interface JsonFlattenOptions {
  key?: string;
  index?: number;
  showComma: boolean;
  length: number;
  type:
    | 'content'
    | 'objectStart'
    | 'objectEnd'
    | 'objectCollapsed'
    | 'arrayStart'
    | 'arrayEnd'
    | 'arrayCollapsed';
}

interface JsonFlattenReturnType extends JsonFlattenOptions {
  content: string;
  level: number;
  path: string;
}

export function getDataType(value: unknown): string {
  return Object.prototype.toString
    .call(value)
    .slice(8, -1)
    .toLowerCase();
}

export function jsonFlatten(
  data: string | number | boolean | unknown[] | Record<string, unknown> | null,
  path = 'root',
  level = 0,
  options: JsonFlattenOptions,
): JsonFlattenReturnType[] {
  const { key, index, type = 'content', showComma = false, length = 1 } =
    options || ({} as JsonFlattenOptions);
  const dataType = getDataType(data);

  if (dataType === 'array') {
    const inner = (data as unknown[])
      .map((item, idx, arr) =>
        jsonFlatten(item, `${path}[${idx}]`, level + 1, {
          index: idx,
          showComma: idx !== arr.length - 1,
          length,
          type,
        }),
      )
      .flat();
    return [
      jsonFlatten('[', path, level, {
        showComma: false,
        key,
        length: (data as unknown[]).length,
        type: 'arrayStart',
      })[0],
    ].concat(
      inner,
      jsonFlatten(']', path, level, {
        showComma,
        length: (data as unknown[]).length,
        type: 'arrayEnd',
      })[0],
    );
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
            length,
            type,
          },
        ),
      )
      .flat();
    return [
      jsonFlatten('{', path, level, {
        showComma: false,
        key,
        index,
        length: keys.length,
        type: 'objectStart',
      })[0],
    ].concat(
      inner,
      jsonFlatten('}', path, level, { showComma, length: keys.length, type: 'objectEnd' })[0],
    );
  }

  const output = Object.entries({
    content: data,
    level,
    key,
    index,
    path,
    showComma,
    length,
    type,
  }).reduce((acc, [key, value]) => {
    if (value !== undefined) {
      return {
        ...acc,
        [key]: value,
      };
    }
    return acc;
  }, {}) as JsonFlattenReturnType;

  return [output];
}
