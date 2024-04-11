"use client";

import { useState, useEffect } from "react";

export function useDebounce<T>(value: T, delay?: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const Timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay || 500);
    return () => {
      clearTimeout(Timer);
    };
  }, [value, delay]);
  return debouncedValue;
}
