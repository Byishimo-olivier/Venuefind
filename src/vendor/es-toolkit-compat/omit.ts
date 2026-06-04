export default function omit<T extends Record<string, unknown>>(source: T | null | undefined, paths: string[] = []) {
  const result = { ...(source || {}) };
  for (const path of paths) {
    delete result[path];
  }
  return result;
}
