import { useState } from "react";
import { sendFriendRequest } from "../services/api";

import SendIcon from "../assets/send.svg";
import "../styles/SendFriendRequest.css";

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
    <div>
      <div className="send-friend-request">
        <textarea
          placeholder="Entrez l'ID de l'ami"
          value={friendId}
          onChange={(e) => setFriendId(e.target.value)}
        />
        <button
          onClick={handleSendFriendRequest}
        >
          <img src={SendIcon} alt="send" />
        </button>
      </div>
    </div>
  );
}

export default SendFriendRequest;
