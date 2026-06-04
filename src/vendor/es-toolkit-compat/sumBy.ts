import { iteratee } from './helpers';

export default function sumBy<T>(array: T[] | null | undefined, selector?: ((item: T) => unknown) | string) {
  const pick = iteratee(selector);
  return (array || []).reduce((total, item) => total + Number(pick(item) || 0), 0);
}
