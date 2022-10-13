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
  content: string | number | null | boolean;
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
    const inner = arrFlat(
      (data as JSONDataType[]).map((item, idx, arr) =>
        jsonFlatten(item, `${path}[${idx}]`, level + 1, {
          index: idx,
          showComma: idx !== arr.length - 1,
          length,
          type,
        }),
      ),
    ) as JSONFlattenReturnType[];
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
    const inner = arrFlat(
      keys.map((objKey, idx, arr) =>
        jsonFlatten(
          (data as Record<string, JSONDataType>)[objKey],
          /^[a-zA-Z_]\w*$/.test(objKey) ? `${path}.${objKey}` : `${path}["${objKey}"]`,
          level + 1,
          {
            key: objKey,
            showComma: idx !== arr.length - 1,
            length,
            type,
          },
        ),
      ),
    ) as JSONFlattenReturnType[];
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

  return [
    {
      content: data as JSONFlattenReturnType['content'],
      level,
      key,
      index,
      path,
      showComma,
      length,
      type,
    },
  ];
}

export function arrFlat<T extends unknown[]>(arr: T): unknown[] {
  if (typeof Array.prototype.flat === 'function') {
    return arr.flat();
  }
  const stack = [...arr];
  const result = [];
  while (stack.length) {
    const first = stack.shift();
    if (Array.isArray(first)) {
      stack.unshift(...first);
    } else {
      result.push(first);
    }
  }
  return result;
}

export function cloneDeep<T extends unknown>(source: T, hash = new WeakMap()): T {
  if (source === null || source === undefined) return source;
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

// function jsonFlattenNext(data: JSONDataType, path = 'root'): JSONFlattenReturnType[] {
//   function test(content: unknown, path: string, level: number, options: JSONFlattenOptions) {
//     const { type = 'content', key, index, showComma, length } = options || {};
//     return {
//       content,
//       level,
//       key,
//       index,
//       path,
//       showComma,
//       length,
//       type,
//     };
//   }

//   let endObj = {} as Record<string, unknown>;
//   let i = 0;
//   let output: any = [data];
//   let startArr = [];
//   while (output.length || endObj[i]) {
//     if (i && endObj[i]) {
//       const k = endObj[i];
//       delete endObj[i];
//       startArr.push(k);
//       i++;
//     } else {
//       const now = output.shift();
//       if (Array.isArray(now)) {
//         startArr.push(
//           test('[', path, 0, {
//             type: 'arrayStart',
//             showComma: false,
//             length: now.length,
//           }),
//         );
//         output = now.concat(output);
//         Object.keys(endObj)
//           .sort((a, b) => Number(b) - Number(a))
//           .forEach(id => {
//             endObj[Number(id) + now.length + 1] = endObj[id];
//             delete endObj[id];
//           });
//         endObj[i + now.length] = ']';
//       } else if (typeof now === 'object') {
//         startArr.push(
//           test('{', path, 0, {
//             type: 'objectStart',
//             showComma: false,
//             length: Object.keys(now).length,
//           }),
//         );
//         output = Object.keys(now)
//           .map(key => now[key])
//           .concat(output);
//         Object.keys(endObj)
//           .sort((a, b) => Number(b) - Number(a))
//           .forEach(id => {
//             endObj[Number(id) + Object.keys(now).length + 1] = endObj[id];
//             delete endObj[id];
//           });
//         endObj[i + Object.keys(now).length] = '}';
//       } else {
//         startArr.push(
//           test(now, path, 0, {
//             type: 'content',
//             showComma: false,
//             length: 0,
//           }),
//         );
//       }
//     }
//   }

//   return startArr as any;
// }
