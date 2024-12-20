import useNotifications from "../hooks/useNotifications"

function Notifications() {
  const { friendRequests, acceptedRequests, messages } = useNotifications();

  return (
    <div style={{ padding: "20px" }}>
      <h2>Notifications</h2>

      <h3>Demandes d'ami reçues</h3>
      <ul>
        {friendRequests.map((request, index) => (
          <li key={index}>
            Utilisateur ID : {request.userId}
          </li>
        ))}
      </ul>

      <h3>Demandes d'ami acceptées</h3>
      <ul>
        {acceptedRequests.map((request, index) => (
          <li key={index}>
            ID Demande : {request.id}, Envoyée par : {request.senderId}, Date :{" "}
            {new Date(request.requestedAt).toLocaleString()}
          </li>
        ))}
      </ul>

      <h3>Messages reçus</h3>
      <ul>
        {messages.map((message, index) => (
          <li key={index}>
            ID : {message.id}, Émetteur : {message.emitterId}, Message : "{message.content}", Envoyé à :{" "}
            {new Date(message.sendAt).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Notifications;
