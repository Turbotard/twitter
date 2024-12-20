import { useEffect, useState } from "react";

interface FriendRequestReceived {
  userId: string;
}

interface FriendRequestAccepted {
  id: string;
  senderId: string;
  requestedAt: string;
}

interface MessageReceived {
  id: string;
  emitterId: string;
  content: string;
  sendAt: string;
}


export default function useNotifications(){
  const [friendRequests, setFriendRequests] = useState<FriendRequestReceived[]>([]);
  const [acceptedRequests, setAcceptedRequests] = useState<FriendRequestAccepted[]>([]);
  const [messages, setMessages] = useState<MessageReceived[]>([]);

  useEffect(() => {
    const eventSource = new EventSource("http://localhost:3000/notifications", { withCredentials: true });

    eventSource.addEventListener("friend-request-received", (event) => {
      const data: FriendRequestReceived = JSON.parse(event.data);
      console.log("friend-request-received" + data);
      setFriendRequests((prev) => [...prev, data]);
      console.log("Demande d'ami reçue :", data);
    });

    eventSource.addEventListener("friend-request-accepted", (event) => {
      const data: FriendRequestAccepted = JSON.parse(event.data);
      console.log("friend-request-accepted" + data);
      setAcceptedRequests((prev) => [...prev, data]);
      console.log("Demande d'ami acceptée :", data);
    });  
    
    eventSource.addEventListener("message-received", (event) => {
      const data: MessageReceived = JSON.parse(event.data);
      console.log("message-received" + data);
      setMessages((prev) => [...prev, data]);
      console.log("Message reçu :", data);
    });

    return () => {
      eventSource.close();
    };
  }, []);

  return { friendRequests, acceptedRequests, messages };
};

