export default function range(start: number, end?: number, step = 1) {
  const output: number[] = [];
  const from = end === undefined ? 0 : start;
  const to = end === undefined ? start : end;
  const direction = step || (from <= to ? 1 : -1);

  if (direction > 0) {
    for (let value = from; value < to; value += direction) output.push(value);
  } else {
    for (let value = from; value > to; value += direction) output.push(value);
  }

  return output;
}
