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

export function cloneDeep<T extends unknown>(source: T, hash = new WeakMap()): T {
  if (source === null) return source;
  if (source instanceof Date) return new Date(source) as T;
  if (source instanceof RegExp) return new RegExp(source) as T;
  if (typeof source !== 'object') return source;
  if (hash.get(source as Record<string, unknown>))
    return hash.get(source as Record<string, unknown>);

  if (Array.isArray(source)) {
    const output = source.map(item => cloneDeep(item, hash));
    hash.set(source, output);
    return output as T;
  }
  const output = {} as T;
  for (const key in source) {
    output[key] = cloneDeep(source[key], hash);
  }
  hash.set(source as Record<string, unknown>, output);
  return output as T;
}

export function stringToAutoType(source: string): unknown {
  let value;
  if (source === 'null') value = null;
  else if (source === 'undefined') value = undefined;
  else if (source === 'true') value = true;
  else if (source === 'false') value = false;
  else if (
    source[0] + source[source.length - 1] === '""' ||
    source[0] + source[source.length - 1] === "''"
  ) {
    value = source.slice(1, -1);
  } else if ((typeof Number(source) === 'number' && !isNaN(Number(source))) || source === 'NaN') {
    value = Number(source);
  } else {
    value = source;
  }
  return value;
}
