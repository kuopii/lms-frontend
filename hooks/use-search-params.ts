"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

export const useUpdateSearchParams = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const params = useMemo(() => {
    const paramObj: Record<string, string | null> = {};
    searchParams.forEach((value, key) => {
      paramObj[key] = value;
    });
    return paramObj;
  }, [searchParams]);

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const newParams = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          newParams.set(key, value);
        } else {
          newParams.delete(key);
        }
      });

      router.push(`${pathname}?${newParams.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams],
  );

  const resetParams = useCallback(() => {
    router.push(pathname, { scroll: false });
  }, [router, pathname]);

  return { params, updateParams, resetParams };
};
