import React, { useState, useEffect } from "react";
import { sendMessage, getMessages } from "../services/api";

const USER_ID = "63d6fe28-934a-4d9d-a775-1370bbbbb972"; // ID de l'utilisateur connecté (test)
const RECEIVER_ID = "61b6b6ea-58e7-446a-be9f-f8e6cc774166"; // ID de l'utilisateur à qui envoyer des messages (john.doe)
const MESSAGE_ID = "id_random_car_jai_pas_compris"; // ID du message pour le test
interface Message {
    senderId: string;
    receiverId: string;
    content: string;
    timestamp: string; // Pour trier les messages
  }
  
  const Chat: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
  
    // Récupérer les messages dans les deux sens
    useEffect(() => {
      const interval = setInterval(fetchMessages, 3000);
      fetchMessages();
      return () => clearInterval(interval);
    }, []);
  
    async function fetchMessages() {
      try {
        // Messages envoyés par moi (USER_ID) vers RECEIVER_ID
        const sentMessages = await getMessages(RECEIVER_ID);
  
        // Messages reçus par moi (USER_ID) de RECEIVER_ID
        const receivedMessages = await getMessages(USER_ID);
  
        // Fusionner et trier par timestamp (ordre chronologique)
        const allMessages = [...sentMessages, ...receivedMessages].sort(
          (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
  
        setMessages(allMessages);
      } catch (err) {
        console.error("Erreur de récupération des messages :", err);
      }
    }
  
    async function handleSendMessage() {
      if (!newMessage.trim()) return;
  
      try {
        await sendMessage(MESSAGE_ID, RECEIVER_ID, newMessage);
        setNewMessage("");
        fetchMessages(); // Rafraîchir immédiatement après l'envoi
      } catch (err) {
        console.error("Erreur d'envoi :", err);
      }
    }
  
    return (
      <div>
        <h2>Chat</h2>
        <div style={{ border: "1px solid #ccc", height: "300px", overflowY: "scroll" }}>
          {messages.map((msg, index) => (
            <div
              key={index}
              style={{
                margin: "10px",
                textAlign: msg.senderId === USER_ID ? "right" : "left",
              }}
            >
              <span
                style={{
                  backgroundColor: msg.senderId === USER_ID ? "#dcf8c6" : "#fff",
                  padding: "5px 10px",
                  borderRadius: "10px",
                  display: "inline-block",
                }}
              >
                {msg.content}
              </span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: "10px" }}>
          <input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Tapez un message..."
            style={{ marginRight: "10px", padding: "5px" }}
          />
          <button onClick={handleSendMessage} style={{ padding: "5px" }}>
            Envoyer
          </button>
        </div>
      </div>
    );
  };
  
  export default Chat;