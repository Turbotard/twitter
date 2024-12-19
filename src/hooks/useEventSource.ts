import { useEffect } from "react";

const useEventSource = (url: string, listeners: Record<string, (event: MessageEvent) => void>) => {
  useEffect(() => {
    const eventSource = new EventSource(url, { withCredentials: true });

    Object.entries(listeners).forEach(([eventName, callback]) => {
      eventSource.addEventListener(eventName, callback);
    });

    return () => {
      Object.entries(listeners).forEach(([eventName, callback]) => {
        eventSource.removeEventListener(eventName, callback);
      });
      eventSource.close();
    };
  }, [url, listeners]);
};

export default useEventSource;
