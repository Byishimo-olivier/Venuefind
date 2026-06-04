import { iteratee } from './helpers';

export default function uniqBy<T>(array: T[] | null | undefined, selector?: ((item: T) => unknown) | string) {
  const pick = iteratee(selector);
  const seen = new Set<unknown>();
  const output: T[] = [];

  for (const item of array || []) {
    const key = pick(item);
    if (seen.has(key)) continue;
    seen.add(key);
    output.push(item);
  }

  return output;
}
