import { useCallback, useEffect, useLayoutEffect, useRef } from "react";

const useEnhancedEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

function useEventCallback<A extends any[], R = void>(
  callback: (...args: A) => R
) {
  const ref = useRef(callback);
  useEnhancedEffect(() => {
    console.debug("effect");
    ref.current = callback;
  });
  return useCallback((...args: A) => ref.current(...args), []);
}

export default useEventCallback;
