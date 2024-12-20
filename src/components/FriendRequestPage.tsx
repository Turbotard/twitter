import { useEffect, useState } from "react";
import { getFriendRequest, acceptFriendRequest } from "../services/api";
import { FriendRequest } from "../models/FriendRequest";
import SendFriendRequest from "./SendFriendRequest";

import CheckIcon from "../assets/check-icon.svg";
import "../styles/FriendRequests.css";

function FriendRequests() {
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [processingRequest, setProcessingRequest] = useState<string | null>(
    null
  );

  useEffect(() => {
    const fetchFriendRequests = async () => {
      setIsLoading(true);
      try {
        const data = await getFriendRequest();
        if (typeof data === "string") {
          setError(data);
        } else {
          const sortedData = [...data].sort(
            (a, b) =>
              new Date(b.requestedAt).getTime() -
              new Date(a.requestedAt).getTime()
          );
          setFriendRequests(sortedData);
          setError(null);
        }
      } catch {
        setError(
          "Erreur inconnue lors de la récupération des demandes d'ami."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchFriendRequests();
  }, []);

  const handleAcceptRequest = async (requestId: string) => {
    setProcessingRequest(requestId);
    try {
      const response = await acceptFriendRequest(requestId);
      if (response.status !== 200) {
        setError("Erreur 200 lors de l'acceptation de la demande d'ami.");
      } else {
        setFriendRequests((prevRequests) =>
          prevRequests.filter((request) => request.id !== requestId)
        );
        setError(null);
      }
    } catch {
      console.log("Erreur debug");
      setError("Erreur incconue lors de l'acceptation de la demande d'ami.");
    } finally {
      setProcessingRequest(null);
    }
  };

  return (
    <div className="friend-requests-container">
      <SendFriendRequest />
      <hr />
      <h2 className="title">Demandes d'ami</h2>

      {isLoading && <p className="friend-request-content">Chargement des demandes...</p>}

      {error && <p className="friend-request-content">{error}</p>}

      {!isLoading && !error && friendRequests.length === 0 && (
        <p className="friend-request-content">Aucune demande d'ami trouvée.</p>
      )}

      {!isLoading && !error && friendRequests.length > 0 && (
        <ul>
          {friendRequests.map((request) => (
            <li className="friend-request-element" key={request.id}>
              <div className="friend-request-info">
                <div className="friend-request-sender">
                  {request.senderId}
                </div>
                <div>
                  Reçue le : {new Date(request.requestedAt).toLocaleString()}
                </div>
              </div>
              <button
                onClick={() => handleAcceptRequest(request.id)}
                disabled={processingRequest === request.id}
              >
                {processingRequest === request.id
                  ? "Traitement..."
                  : <img className="friend-request-checkmark" src={CheckIcon} alt="send" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default FriendRequests;
