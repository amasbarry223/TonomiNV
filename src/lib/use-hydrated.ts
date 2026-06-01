import { useSyncExternalStore } from 'react'

/**
 * Returns `true` only after the component is hydrated on the client.
 * Avoids `setState` in `useEffect` (linted) and prevents SSR/CSR mismatch.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    // no-op subscribe: hydration is the only thing we care about
    () => () => {},
    () => true,
    () => false
  )
}

