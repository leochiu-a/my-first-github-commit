import {
  FetcherWithComponents,
  useFetcher,
  useSearchParams,
} from "@remix-run/react";
import { useEffect, useState } from "react";

export type FetcherWithComponentsReset<T> = FetcherWithComponents<T> & {
  reset: () => void;
};

/**
 * workaround for useFetcher without reset()
 * https://github.com/remix-run/remix/discussions/2749#discussioncomment-7276763
 */
export function useFetcherWithReset<T>(): FetcherWithComponentsReset<T> {
  const [searchParams] = useSearchParams();
  const fetcher = useFetcher<T>({
    key: searchParams.get("username") ?? "",
  });
  const [data, setData] = useState(fetcher.data);

  useEffect(() => {
    if (fetcher.state === "idle") {
      setData(fetcher.data);
    }
  }, [fetcher.state, fetcher.data]);

  return {
    ...fetcher,
    data: data as T,
    reset: () => setData(undefined),
  };
}
