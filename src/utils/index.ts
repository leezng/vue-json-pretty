interface JSONFlattenOptions {
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

export type JSONDataType = string | number | boolean | unknown[] | Record<string, unknown> | null;

export interface JSONFlattenReturnType extends JSONFlattenOptions {
  content: string;
  level: number;
  path: string;
}

export function emitError(message: string): void {
  throw new Error(`[VueJSONPretty] ${message}`);
}

export function getDataType(value: unknown): string {
  return Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
}

export function jsonFlatten(
  data: JSONDataType,
  path = 'root',
  level = 0,
  options?: JSONFlattenOptions,
): JSONFlattenReturnType[] {
  const {
    key,
    index,
    type = 'content',
    showComma = false,
    length = 1,
  } = options || ({} as JSONFlattenOptions);
  const dataType = getDataType(data);

  if (dataType === 'array') {
    const inner = (data as JSONDataType[])
      .map((item, idx, arr) =>
        jsonFlatten(item, `${path}[${idx}]`, level + 1, {
          index: idx,
          showComma: idx !== arr.length - 1,
          length,
          type,
        }),
      )
      // No flat, for compatibility.
      .reduce((acc, val) => acc.concat(val), []);
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
    const keys = Object.keys(data as Record<string, JSONDataType>);
    const inner = keys
      .map((objKey, idx, arr) =>
        jsonFlatten(
          (data as Record<string, JSONDataType>)[objKey],
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
      // No flat, for compatibility.
      .reduce((acc, val) => acc.concat(val), []);
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
  }, {}) as JSONFlattenReturnType;

  return [output];
}
