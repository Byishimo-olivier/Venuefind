export default function throttle<T extends (...args: never[]) => void>(callback: T, wait = 0) {
  let lastRun = 0;
  let timeout: ReturnType<typeof setTimeout> | undefined;

  return ((...args: Parameters<T>) => {
    const now = Date.now();
    const remaining = wait - (now - lastRun);

    if (remaining <= 0) {
      if (timeout) clearTimeout(timeout);
      timeout = undefined;
      lastRun = now;
      callback(...args);
      return;
    }

    if (!timeout) {
      timeout = setTimeout(() => {
        lastRun = Date.now();
        timeout = undefined;
        callback(...args);
      }, remaining);
    }
  }) as T;
}
