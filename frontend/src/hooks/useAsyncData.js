import { useCallback, useEffect, useState } from "react";

/**
 * Generic async data hook for the API service layer.
 *
 *   const { data, loading, error, refetch } = useAsyncData(() => getVehicles(), []);
 *
 * - Ignores stale responses after unmount / dependency change.
 * - `refetch()` re-runs the fetcher.
 */
export function useAsyncData(fetcher, deps = []) {
  const [state, setState] = useState({ data: null, loading: true, error: null });
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setState((prev) => ({ ...prev, loading: true, error: null }));

    Promise.resolve()
      .then(() => fetcher())
      .then((data) => {
        if (!cancelled) setState({ data, loading: false, error: null });
      })
      .catch((error) => {
        if (!cancelled) setState({ data: null, loading: false, error });
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, version]);

  const refetch = useCallback(() => setVersion((v) => v + 1), []);

  return { ...state, refetch };
}

export default useAsyncData;
