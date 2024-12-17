import React, { useState, useEffect } from "react";
import { login, checkAuth } from "../services/api";

interface LoginFormProps {
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, onError }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isAlreadyConnected, setIsAlreadyConnected] = useState(false);

  // Vérifie si l'utilisateur est déjà connecté au montage
  useEffect(() => {
    async function verifyUser() {
      try {
        const isAuthenticated = await checkAuth();
        if (isAuthenticated) {
          setIsAlreadyConnected(true);
          onSuccess("L'utilisateur est déjà connecté.");
        }
      } catch {
        setIsAlreadyConnected(false);
      }
    }

    verifyUser();
  }, [onSuccess]);

  // Tentative de connexion si l'utilisateur n'est pas déjà connecté
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isAlreadyConnected) {
      onSuccess("L'utilisateur est déjà connecté.");
      return;
    }

    try {
      await login(username, password);
      onSuccess("Connexion réussie.");
    } catch (err: unknown) {
      if (err instanceof Error) {
        onError(err.message || "Erreur lors de la connexion.");
      } else {
        onError("Erreur lors de la connexion.");
      }
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", maxWidth: 300 }}
    >
      <h2>Connexion</h2>
      <label>
        Username:
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          disabled={isAlreadyConnected}
        />
      </label>
      <label>
        Password:
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          required
          disabled={isAlreadyConnected}
        />
      </label>
      <button type="submit" disabled={isAlreadyConnected}>
        {isAlreadyConnected ? "Déjà connecté" : "Se connecter"}
      </button>
    </form>
  );
};

export default LoginForm;
