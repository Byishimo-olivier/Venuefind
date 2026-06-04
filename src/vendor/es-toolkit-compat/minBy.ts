import { compareValues, iteratee } from './helpers';

export default function minBy<T>(array: T[] | null | undefined, selector?: ((item: T) => unknown) | string) {
  if (!array?.length) return undefined;
  const pick = iteratee(selector);
  return array.reduce((best, item) => compareValues(pick(item), pick(best)) < 0 ? item : best, array[0]);
}
