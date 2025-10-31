import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function useSyncedParam(key: string, defaultValue = "") {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get(key) || defaultValue);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    router.replace(`?${params.toString()}`);
  }, [value]);

  return [value, setValue] as const;
}
