import { useEffect, useState } from "react";

export const useDebounce = <T extends any>(value: T, delay: number = 500) => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timeoutRef = setTimeout(() => {
      setDebouncedValue(value);
    }, delay)

    return () => {
      clearTimeout(timeoutRef);
    }
  }, [value, delay]);

  return debouncedValue;
}