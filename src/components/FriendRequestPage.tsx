import { useEffect, useState } from "react";
import { getFriendRequest, acceptFriendRequest } from "../services/api";
import { FriendRequest } from "../models/FriendRequest";

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
      if (response.includes("Erreur")) {
        setError(response);
      } else {
        setFriendRequests((prevRequests) =>
          prevRequests.filter((request) => request.id !== requestId)
        );
        setError(null);
      }
    } catch {
      setError("Erreur lors de l'acceptation de la demande d'ami.");
    } finally {
      setProcessingRequest(null);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2>Demandes d'ami</h2>

      {isLoading && <p>Chargement des demandes...</p>}

      {error && <p style={{ color: "red" }}>{error}</p>}

      {!isLoading && !error && friendRequests.length === 0 && (
        <p>Aucune demande d'ami trouvée.</p>
      )}

      {!isLoading && !error && friendRequests.length > 0 && (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {friendRequests.map((request) => (
            <li
              key={request.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "4px",
                padding: "10px",
                marginBottom: "10px",
                backgroundColor: "#f9f9f9",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <div style={{ fontSize: "16px", fontWeight: "bold" }}>
                  Utilisateur : {request.senderId}
                </div>
                <div style={{ fontSize: "14px", color: "#555" }}>
                  Reçue le : {new Date(request.requestedAt).toLocaleString()}
                </div>
              </div>
              <button
                onClick={() => handleAcceptRequest(request.id)}
                disabled={processingRequest === request.id}
                style={{
                  padding: "10px 15px",
                  backgroundColor:
                    processingRequest === request.id ? "#ccc" : "#28A745",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor:
                    processingRequest === request.id ? "not-allowed" : "pointer",
                }}
              >
                {processingRequest === request.id
                  ? "Traitement..."
                  : "Accepter"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default FriendRequests;
