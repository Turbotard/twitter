import { useEffect, useState } from "react";
import { getMessage, sendMessage, deleteMessage } from "../services/api";
import { useParams } from "react-router-dom";
import { FaTrashAlt } from "react-icons/fa";

interface Message {
  id: string;
  content: string;
}

function Messages() {
  const { userId } = useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [newMessage, setNewMessage] = useState<string>("");
  const [isSending, setIsSending] = useState<boolean>(false);

  useEffect(() => {
    if (!userId) {
      setError("Utilisateur non connecté.");
      setIsLoading(false);
      return;
    }

    const fetchMessages = async () => {
      try {
        const data = await getMessage(userId);
        setMessages(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Erreur inconnue lors de la récupération des messages.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [userId]);

  const handleSendMessage = async () => {
    if (!newMessage) {
      setError("Le message ne peut pas être vide.");
      return;
    }
    
    setIsSending(true);

    try {
      if(userId)
      {
        console.log(userId);
        await sendMessage(userId, newMessage);
        setNewMessage("");
        setMessages((prevMessages) => [
          ...prevMessages,
          { id: Date.now().toString(), content: newMessage },
        ]);
        setError(null);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Erreur lors de l'envoi du message.");
      }
    } finally {
      setIsSending(false);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      await deleteMessage(messageId);
      setMessages((prevMessages) => prevMessages.filter((message) => message.id !== messageId));
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Erreur lors de la suppression du message.");
      }
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2>Messages</h2>

      {isLoading && <p>Chargement des messages...</p>}

      {error && <p style={{ color: "red" }}>Erreur : {error}</p>}

      {!isLoading && !error && messages.length === 0 && (
        <p>Aucun message trouvé.</p>
      )}

      {!isLoading && !error && messages.length > 0 && (
        <div>
          {messages.map((message) => (
            <div
              key={message.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "4px",
                padding: "10px",
                marginBottom: "10px",
                backgroundColor: "#f9f9f9",
                position: "relative",
              }}
            >
              <div style={{ marginTop: "8px", fontSize: "16px" }}>
                {message.content}
              </div>
              <FaTrashAlt
                onClick={() => handleDeleteMessage(message.id)}
                style={{
                  color: "red",
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  cursor: "pointer",
                  fontSize: "20px",
                }}
              />
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: "20px" }}>
        <h3>Envoyer un message</h3>
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Écrivez votre message..."
          rows={4}
          style={{ width: "100%", padding: "10px", fontSize: "16px" }}
        />
        <div style={{ marginTop: "10px" }}>
          <button
            onClick={handleSendMessage}
            disabled={isSending}
            style={{
              padding: "10px 15px",
              backgroundColor: isSending ? "#ccc" : "#28A745",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: isSending ? "not-allowed" : "pointer",
            }}
          >
            {isSending ? "Envoi en cours..." : "Envoyer"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Messages;
