import { useState, useEffect } from 'react';

type MonetizationInfo = {
  state: MonetizationState | undefined;
  isApplied: boolean;
  isStarted: boolean;
  isPending: boolean;
  isStopped: boolean;
  detail: MonetizationEventDetail | undefined;
};

export default function useMonetization(): [MonetizationInfo] {
  const [state, setState] = useState<MonetizationState>();
  const [detail, setDetail] = useState<MonetizationEventDetail>();

  function pendingEventHandler(event: MonetizationEvent) {
    setState('pending');
    setDetail(event.detail);
  }
  function stoppedEventHandler(event: MonetizationEvent) {
    setState('stopped');
    setDetail(event.detail);
  }
  function startedEventHandler(event: MonetizationEvent) {
    setState('started');
    setDetail(event.detail);
  }
  function onprogressEventHandler(event: MonetizationEvent) {
    setDetail(event.detail);
  }

  useEffect(() => {
    if (document !== undefined && document.monetization !== undefined) {
      const defaultState = document.monetization.state;
      setState(defaultState);

      document.monetization.addEventListener('monetizationstart', startedEventHandler);
      document.monetization.addEventListener('monetizationpending', pendingEventHandler);
      document.monetization.addEventListener('monetizationstop', stoppedEventHandler);
      document.monetization.addEventListener('monetizationprogress', onprogressEventHandler);
    }

    return () => {
      if (document !== undefined && document.monetization !== undefined) {
        document.monetization.removeEventListener('monetizationstart', startedEventHandler);
        document.monetization.removeEventListener('monetizationpending', pendingEventHandler);
        document.monetization.removeEventListener('monetizationstop', stoppedEventHandler);
        document.monetization.removeEventListener('monetizationprogress', onprogressEventHandler);
      }
    };
  }, []);

  return [
    {
      state,
      isApplied: typeof state !== 'undefined',
      isStarted: state === 'started',
      isPending: state === 'pending',
      isStopped: state === 'stopped',
      detail,
    },
  ];
}
