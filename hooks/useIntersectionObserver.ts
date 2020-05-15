import { useRef, useEffect, RefObject } from 'react';

interface UseIntersectionObserverArgs {
  element: RefObject<HTMLDivElement>;
  onView: () => boolean | void; // return true to stop observer
  threshold?: number[];
  once?: boolean;
  debug?: boolean;
}

/**
 * Apply InteractionObserver to check is target component is in view
 * @param element target element ref create by useRef
 * @param onView callback to execute when target element is in view
 * @param threshold IntersectionObserver.threshold to define how much percentage of target element in view should trigger onView callback,  can be set with multiple value like [0, 0.5, 1]
 * @param once stop observing after onView be triggered
 * @param debug debug mode to print observing status
 */
export default function useIntersectionObserver({
  element,
  onView,
  threshold,
  once,
  debug,
}: UseIntersectionObserverArgs) {
  const observer = useRef<IntersectionObserver | null>(null);
  const last = useRef<number>(-1);
  const handles = useRef<any>({ onView });

  handles.current = { onView };

  function debugLog(...args: any[]) {
    if (!debug) return;
    console.log('%c[IntersectionObserver]', 'color: #C7F0BD;', ...args);
  }

  function removeObserver() {
    if (observer.current && element && element.current) {
      debugLog('stop observing:', element.current);
      observer.current.unobserve(element.current);
    }
  }

  function startObserving() {
    const container = element.current;

    if (container) {
      debugLog('start observing:', container);
      observer.current = new IntersectionObserver(
        ([entry]) => {
          if (Date.now() - last.current < 250) {
            return;
          }
          last.current = Date.now();

          const { isIntersecting } = entry;

          if (isIntersecting && onView) {
            debugLog('isIntersecting:', entry);
            const stopObserver = handles.current.onView();
            if (stopObserver || once) {
              removeObserver();
            }
          }
        },
        {
          threshold: threshold || [0],
        }
      );

      observer.current.observe(container);
    }
  }

  useEffect(() => {
    startObserving();

    return () => {
      removeObserver();
    };
  }, []);
}
