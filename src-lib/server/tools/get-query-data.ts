import type QueryString from 'qs';

export function getQueryString(query: QueryString.ParsedQs, key: string): string {
  const v = query[key];
  if (typeof v === 'string') return v;

  throw new Error('参数' + key + '错误');
}
