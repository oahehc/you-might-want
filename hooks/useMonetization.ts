import { useState, useEffect } from 'react';

type MonetizationState = 'stopped' | 'pending' | 'started' | undefined;
type MonetizationInfo = {
  state: MonetizationState;
  isApplied: boolean;
  isStarted: boolean;
  isPending: boolean;
  isStopped: boolean;
};

export default function useMonetization(): [MonetizationInfo] {
  const [state, setState] = useState<MonetizationState>();

  function pendingEventHandler() {
    setState('pending');
  }
  function stoppedEventHandler() {
    setState('stopped');
  }
  function startedEventHandler() {
    setState('started');
  }

  useEffect(() => {
    // @ts-ignore
    if (document !== undefined && document.monetization !== undefined) {
      // @ts-ignore
      const defaultState = document.monetization.state;

      setState(defaultState);

      // @ts-ignore
      document.monetization.addEventListener('monetizationstart', startedEventHandler);
      // @ts-ignore
      document.monetization.addEventListener('monetizationpending', pendingEventHandler);
      // @ts-ignore
      document.monetization.addEventListener('monetizationstop', stoppedEventHandler);
      // document.monetization.addEventListener('monetizationprogress', pendingEventHandler);
    }

    return () => {
      // @ts-ignore
      document.monetization.removeEventListener('monetizationstart', startedEventHandler);
      // @ts-ignore
      document.monetization.removeEventListener('monetizationpending', pendingEventHandler);
      // @ts-ignore
      document.monetization.removeEventListener('monetizationstop', stoppedEventHandler);
    };
  }, []);

  return [
    {
      state,
      isApplied: typeof state !== 'undefined',
      isStarted: state === 'started',
      isPending: state === 'pending',
      isStopped: state === 'stopped',
    },
  ];
}
