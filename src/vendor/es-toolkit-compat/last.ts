export default function last<T>(array: ArrayLike<T> | null | undefined) {
  return array && array.length ? array[array.length - 1] : undefined;
}
