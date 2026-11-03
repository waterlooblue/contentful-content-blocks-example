import { useEffect, useState } from 'react';

export type QueryState<T> =
  | { status: 'loading' }
  | { status: 'error'; error: Error }
  | { status: 'success'; data: T };

// Runs an async loader when `key` changes and cancels the previous request.
export function useQuery<T>(key: string, load: (signal: AbortSignal) => Promise<T>): QueryState<T> {
  const [state, setState] = useState<QueryState<T>>({ status: 'loading' });

  useEffect(() => {
    const controller = new AbortController();
    setState({ status: 'loading' });
    load(controller.signal)
      .then((data) => setState({ status: 'success', data }))
      .catch((error: Error) => {
        if (!controller.signal.aborted) setState({ status: 'error', error });
      });
    return () => controller.abort();
    // `load` is expected to change only when `key` does.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return state;
}
