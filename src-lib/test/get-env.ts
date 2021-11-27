/**
 * 获取环境变量值
 * @param name
 * @param defaultValue
 * @returns
 */
export function getEnv(name: string, defaultValue = ''): string {
  const { env = {} } = process;
  if (Object.prototype.hasOwnProperty.call(env, name)) {
    return env[name] || '';
  }
  return defaultValue;
}
