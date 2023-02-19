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

/**
 * 从环境变量中获取一个值
 * @param name 环境变量名
 * @param defaultValue 默认值
 */
export function getEnvString(name: string, fallback?: string): string {
  const result = process.env[name] ?? fallback;
  if (result === undefined) {
    throw new Error(`请配置环境变量 ${name}`);
  }

  return result;
}

export function getEnvInt(envName: string, fallback?: number): number {
  const envValue = process.env[envName];
  if (envValue) {
    const envValueNumber = Number.parseInt(envValue, 10);
    if (!Number.isNaN(envValueNumber)) {
      return envValueNumber;
    }

    throw new Error(`请配置环境变量 ${envName} 为数字字符串`);
  }

  if (fallback === undefined) {
    throw new Error(`请配置环境变量 ${envName}`);
  }

  return fallback;
}

