import { useState } from "react";
import useEventSource from "../hooks/useEventSource";

function Notifications() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [friendRequests, setFriendRequests] = useState<any[]>([]);

  useEventSource("http://localhost:3000/notifications", {
    "message-received": (event) => {
      const data = JSON.parse(event.data);
      console.log("Message reçu :", data);
      setNotifications((prev) => [...prev, data]);
    },
    "friend-request-received": (event) => {
      const data = JSON.parse(event.data);
      console.log("Demande d'ami reçue :", data);
      setFriendRequests((prev) => [...prev, data]);
    },
  });

  return (
    <div style={{ padding: "20px" }}>
      <h2>Notifications</h2>
      <ul>
        {notifications.map((notification, index) => (
          <li key={index}>{JSON.stringify(notification)}</li>
        ))}
      </ul>

      <h2>Demandes d'ami</h2>
      <ul>
        {friendRequests.map((request, index) => (
          <li key={index}>{JSON.stringify(request)}</li>
        ))}
      </ul>
    </div>
  );
}

export default Notifications;
