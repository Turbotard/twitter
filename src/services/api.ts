import { v4 as uuidv4 } from "uuid";

export async function login(username: string, password: string): Promise<string> {
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

export async function register(username: string, password: string): Promise<string> {
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

export async function sendFriendRequest(friendId: string): Promise<string> {
  const uniqueId = generateUniqueId();
  const response = await fetch(`http://localhost:3000/social/friend-request/${uniqueId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ friendId  }),
  });

  if (response.status === 201) {
    return "Demande d'ami envoyé avec succès";
  }

  const error = await response.json();
  return error + "Demande Error";
}


export async function checkAuth(): Promise<boolean> {
  const response = await fetch("http://localhost:3000/auth/me", {
    method: "GET",
  });
  return response.status === 200;
}


const generateUniqueId = () => {
  const id = uuidv4(); 
  return id
};