import { v4 as uuidv4 } from "uuid";
import { User } from "../models/User";
import store from "../store/store";


export async function login(username: string, password: string){
  const updateUserId = store.getState().updateUserId;

  const response = await fetch("http://localhost:3000/auth/login", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (response.status === 201) {
    const user = await checkAuth();
    updateUserId(user.id);
    localStorage.setItem("connectedUser", user.id);
    return "L'utilisateur est bien connecté."  + user.id;
  }

  const error = await response.json();
  throw new Error(error.message || "Échec de la connexion.");
}

export async function register(username: string, password: string){
  const response = await fetch("http://localhost:3000/auth/register", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (response.status === 201) {
    return "L'utilisateur a été enregistré avec succès.";
  }

  const error = await response.json();
  throw new Error(error.message || "Échec de l'inscription.");
}

export async function getMessage(userId: string)
{
  const response = await fetch(`http://localhost:3000/messages/${userId}`, {
    method: "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json" }
  });
  if (response.ok) {
    const data = await response.json();
    return data
  }
  else {
    throw new Error(`Erreur lors de la récupération des message de l'utilisateur : ${userId} ${response.status} ${response.statusText}`);
  }
}

export async function sendMessage(receiverId: string, content: string)
{
  const uniqueId = generateUniqueId();
  const response = await fetch(`http://localhost:3000/chat/${uniqueId}/send`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ receiverId, content }),
  });
  if (response.ok) {
    return "Message Envoyé"
  }
  else {
    throw new Error(`Erreur lors de l'envoie a l'utilisateur : ${receiverId} ${response.status} ${response.statusText}`);
  }
}

export async function deleteMessage(messageId: string)
{
  const response = await fetch(`http://localhost:3000/chat/${messageId}`, {
    method: "DELETE",
    credentials: "include"
  });
  if (response.ok) {
    return "Message supprimé"
  }
  else {
    throw new Error(`Erreur lors de la suppression du message: ${messageId} ${response.status} ${response.statusText}`);
  }
}

export async function sendFriendRequest(receiverId: string){
  const uniqueId = generateUniqueId();
  const response = await fetch(`http://localhost:3000/social/friend-request/${uniqueId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ receiverId }),
  });

  if (response.status === 201) {
    return "Demande d'ami envoyé avec succès";
  }

  const error = await response.json();
  return error + "Demande Error";
}

export async function checkAuth(){
  const response = await fetch("http://localhost:3000/auth/me", {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    const data = await response.json();
    return new User(data.id, data.username);
  } else {
    throw new Error(`Erreur d'authentification : ${response.status} ${response.statusText}`);
  }
}

const generateUniqueId = () => {
  const id = uuidv4(); 
  return id
};