import { getValue } from './helpers';

export default function get(source: unknown, path: unknown, fallback?: unknown) {
  return getValue(source, path, fallback);
}
