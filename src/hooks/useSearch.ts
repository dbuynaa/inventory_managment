'use client';

import { useCallback } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export function useSearch() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Get a new searchParams string by merging the current
  // searchParams with a provided key/value pair
  const createQueryString = useCallback(
    (name?: string, value?: string) => {
      const params = new URLSearchParams(searchParams);
      if (name) {
        if (value) {
          params.set(name, value);
        } else {
          params.delete(name);
        }
      } else {
        for (const key of params.keys()) {
          params.delete(key);
        }
      }
      return params.toString();
    },
    [searchParams]
  );

  const useSearch = useCallback(
    (name?: string, value?: string) => {
      router.push(`${pathname}?${createQueryString(name, value)}`);
    },
    [createQueryString, pathname, router]
  );

  return useSearch;
}

export function useSearchArray() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const params = new URLSearchParams(searchParams);

  // Get a new searchParams string by merging the current
  // searchParams with a provided key/value pair
  const createQueryString = useCallback(
    (props: object | null) => {
      if (!props)
        for (const key of params.keys()) {
          params.delete(key);
        }
      else
        for (const [name, value] of Object.entries(props)) {
          if (name) {
            if (value) {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
              params.set(name, value);
            } else {
              params.delete(name);
            }
          }
        }

      return params.toString();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchParams]
  );

  const useSearchArray = useCallback(
    (props: object) => {
      router.push(`${pathname}?${createQueryString(props)}`);
    },
    [createQueryString, pathname, router]
  );
  return useSearchArray;
}
