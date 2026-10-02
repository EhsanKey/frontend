'use client';

import { useEffect, useState } from 'react';

const DEBOUNCE_DELAY_MS = 400;

export const useDebounce = <T>(value: T, delay: number = DEBOUNCE_DELAY_MS): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
