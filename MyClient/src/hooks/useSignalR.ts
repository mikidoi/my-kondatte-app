import { useEffect, useRef } from "react";
import * as signalR from "@microsoft/signalr";

interface SignalREvent {
  name: string;
  handler: (...args: unknown[]) => void;
}

export const useSignalR = (url: string, events: SignalREvent[]): void => {
  const connectionRef = useRef<signalR.HubConnection | null>(null);

  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(url)
      .withAutomaticReconnect()
      .build();

    // ✅ Register handlers
    events.forEach(({ name, handler }) => {
      connection.on(name, handler);
    });

    connection
      .start()
      .then(() => console.log("✅ SignalR connected")) // ← add this to verify connection
      .catch((err: Error) => console.error("SignalR connection error:", err));

    connectionRef.current = connection;

    return () => {
      // ✅ Clean up handlers before stopping
      events.forEach(({ name }) => {
        connection.off(name);
      });
      connection.stop();
    };
  }, [url]); // ← url is enough, keep events out to avoid reconnecting on every render
};
