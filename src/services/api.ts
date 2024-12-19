import { v4 as uuidv4 } from "uuid";
import { User } from "../models/User";
import store, { useUsernameStore }  from "../store/store";


export async function login(username: string, password: string){
  const updateUserId = store.getState().updateUserId;
  const updateUsername = useUsernameStore.getState().updateUsernameId;

  const response = await fetch("http://localhost:3000/auth/login", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (response.status === 201) {
    const user = await checkAuth();
    updateUserId(user.id);
    updateUsername(user.username);
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

export async function logOut()
{ 
  const response = await fetch(`http://localhost:3000/auth/logout`, {
    method: "POST",
    credentials: "include"
  });
  console.log(response.status)
  if (response.ok) {
    localStorage.removeItem("connectedUser");
    return "logout"
  }
  else {
    throw new Error(`Erreur lors du Logout ${response.status} ${response.statusText}`);
  }
}

export async function sendFriendRequest(receiverId: string){
  const uniqueId = generateUniqueId();
  console.log("uniqueID  = " + uniqueId);
  console.log("receiverId  = " + receiverId);
  const response = await fetch(`http://localhost:3000/social/friend-request/${uniqueId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ receiverId }),
  });

  if (response.status === 201) {
    return "Demande d'ami envoyé avec succès";
  }

  const error = await response.json();
  return error + "Demande Error";
}

export async function getFriendRequest(){
  const response = await fetch(`http://localhost:3000/social/friend-requests`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
console.log(response.status);
  if (response.status === 200) {
    const data = await response.json();
    console.log("Demande d'ami récupérée" + data);
    return data;
  }

  const error = await response.json();
  return `${error} - Erreur lors de la récupération des demandes d'ami`;
}


export async function acceptFriendRequest(requestId: string){
  const response = await fetch(`http://localhost:3000/social/friend-request/${requestId}/accept`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include"
  });

  if (response.status === 200) {
    return "Demande d'ami" + requestId + " accepté";
  }

  const error = await response.json();
  return (error + "Erreur lors de l'acceptation de la demande d'ami");
}

export async function getFriends(){
  const response = await fetch("http://localhost:3000/social/friends", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  if (response.ok) {
    const data = await response.json();
    return data
  } else {
    throw new Error(`Erreur lors de la récupération des amis : ${response.status} ${response.statusText}`);
  }
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

export async function logout(){
  const removeUserId = store.getState().removeUserId;
  
  const response = await fetch("http://localhost:3000/auth/logout", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    removeUserId();
    localStorage.removeItem("connectedUser");
    return "Déconnexion réussie.";
  } else {
    throw new Error(`Erreur lors de la déconnexion : ${response.status} ${response.statusText}`);
  }
}

const generateUniqueId = () => {
  const id = uuidv4(); 
  return id
};
