export function isObject<T>(item: T): boolean {
  return (item && typeof item === 'object' && !Array.isArray(item));
}
