
export function tileResult(data: any): {
    [key: string]: any;
} {
  if (data && typeof data === 'object') {
    if (Array.isArray(data)) {
      const t = [];
      for (let i = 0; i < data.length; i += 1) {
        t.push(tileResult(data[i]));
      }
      return t;
    }
    if (data.constructor !== Object) return data;

    const result: {
         [key: string]: any;
      } = {};

    const keys = Object.keys(data);
    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i];
      // eslint-disable-next-line no-continue
      // if (key === '_id') continue;
      const item = data[key];
      if (item && typeof item === 'object') {
        if (Array.isArray(item) || item.constructor !== Object) {
          result[key] = tileResult(item);
        } else {
          const temp = tileResult(item);
          const tempKeys = Object.keys(temp);
          for (let k = 0; k < tempKeys.length; k += 1) {
            const tempKey = tempKeys[k];
            result[`${key}.${tempKey}`] = temp[tempKey];
          }
        }
      } else {
        result[key] = item;
      }
    }
    return result;
  }
  return data;
}


export function getSchemaBoolean(v?: boolean | (() => boolean) | [boolean, string] | [() => boolean, string]): boolean | undefined {
  if (typeof v === 'boolean') return v;
  if (typeof v === 'function') {
    const t = v();
    if (typeof t === 'boolean') return t;
  }
}

export function getSchemaNumber(v?: number | Date | [number, string] | [Date, string] | readonly [number, string] | readonly [Date, string]): number | undefined {
  if (typeof v === 'number') return v;
  if (Array.isArray(v)) {
    const t = v[0];
    if (typeof t === 'number') return t;
  }
}

export function getSchemaEnumString(v?:
  Array<string | number | null> |
  ReadonlyArray<string | number | null> |
  { values: Array<string | number | null> |
    ReadonlyArray<string | number | null>,
    message?: string
  } |
  { [path: string]: string | number | null }): string[] {
  if (Array.isArray(v)) {
    return v.map((t) => {
      return `${t}`;
    });
  }
}
export function getSchemaEnumNumber(v?:
  Array<string | number | null> |
  ReadonlyArray<string | number | null> |
  { values: Array<string | number | null> |
    ReadonlyArray<string | number | null>,
    message?: string
  } |
  { [path: string]: string | number | null }): number[] {
  if (Array.isArray(v)) {
    return v.map((t) => {
      if (typeof t === 'string') {
        return Number.parseFloat(t);
      }
      if (typeof t === 'number') {
        return t;
      }
    }).filter((t) => t !== undefined);
  }
}
