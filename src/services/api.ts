export async function login(
  username: string,
  password: string
): Promise<string> {
  const response = await fetch("http://localhost:3000/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (response.status === 201) {
    return "L'utilisateur est bien connecté.";
  }

  const error = await response.json();
  throw new Error(error.message || "Échec de la connexion.");
}

export async function register(
  username: string,
  password: string
): Promise<string> {
  const response = await fetch("http://localhost:3000/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (response.status === 201) {
    return "L'utilisateur a été enregistré avec succès.";
  }

  const error = await response.json();
  throw new Error(error.message || "Échec de l'inscription.");
}

export async function checkAuth(): Promise<boolean> {
  const response = await fetch("http://localhost:3000/auth/me", {
    method: "GET",
  });
  return response.status === 200;
}

export async function sendMessage(
  messageId: string,
  receiverId: string,
  content: string
): Promise<void> {
  const response = await fetch(`http://localhost:3000/chat/${messageId}/send`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ receiverId, content }),
  });

  if (!response.ok) throw new Error("Erreur lors de l'envoi du message.");
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getMessages(userId: string): Promise<any[]> {
  const response = await fetch(`http://localhost:3000/messages/${userId}`, {
    method: "GET",
  });

  if (!response.ok)
    throw new Error("Erreur lors de la récupération des messages.");
  return response.json();
}
