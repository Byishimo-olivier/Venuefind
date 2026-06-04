import { compareValues, iteratee } from './helpers';

export default function sortBy<T>(array: T[] | null | undefined, selectors?: Array<((item: T) => unknown) | string> | ((item: T) => unknown) | string) {
  const picks = (Array.isArray(selectors) ? selectors : [selectors]).filter(Boolean).map((selector) => iteratee<T>(selector as ((item: T) => unknown) | string));
  if (!array) return [];
  if (!picks.length) return [...array].sort();

  return [...array].sort((a, b) => {
    for (const pick of picks) {
      const result = compareValues(pick(a), pick(b));
      if (result !== 0) return result;
    }
    return 0;
  });
}
