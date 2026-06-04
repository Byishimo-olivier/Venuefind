type Key = string | number | symbol;

export function toPath(path: unknown): Key[] {
  if (Array.isArray(path)) return path as Key[];
  return String(path ?? '')
    .replace(/\[(\d+)\]/g, '.$1')
    .split('.')
    .filter(Boolean);
}

export function iteratee<T>(input?: ((item: T) => unknown) | string | number | symbol) {
  if (typeof input === 'function') return input;
  if (input === undefined) return (item: T) => item;
  return (item: T) => getValue(item, input);
}

export function getValue(source: unknown, path: unknown, fallback?: unknown) {
  let current = source as Record<Key, unknown> | null | undefined;

  for (const key of toPath(path)) {
    if (current == null || !(key in Object(current))) return fallback;
    current = Object(current)[key] as Record<Key, unknown> | null | undefined;
  }

  return current === undefined ? fallback : current;
}

export function compareValues(a: unknown, b: unknown) {
  if (a === b) return 0;
  if (a == null) return 1;
  if (b == null) return -1;
  return a > b ? 1 : -1;
}
