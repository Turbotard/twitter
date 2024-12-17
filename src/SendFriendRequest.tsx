import { useState } from "react";
import { sendFriendRequest } from "./services/api";

function SendFriendRequest() {
  const [friendId, setFriendId] = useState("");

  const handleSendFriendRequest = async () => {
    try {
      await sendFriendRequest(friendId);
      console.log("Requête envoyée pour l'ID d'ami :", friendId);
    } catch (error) {
      console.error("Erreur lors de l'envoi de la requête :", error);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h3>Envoyer une requête d'ami</h3>
      <textarea
        placeholder="Entrez l'ID de l'ami..."
        value={friendId}
        onChange={(e) => setFriendId(e.target.value)}
        style={{ marginBottom: "10px", padding: "10px", fontSize: "16px" }}
      />
      <br />
      <button
        onClick={handleSendFriendRequest}
        style={{
          padding: "10px 15px",
          backgroundColor: "#28A745",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          fontSize: "16px",
        }}
      >
        Envoyer la requête
      </button>
    </div>
  );
}

export default SendFriendRequest;
