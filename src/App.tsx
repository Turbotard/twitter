import React, { useState, useEffect } from "react";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import Chat from "./components/Chat";
import { checkAuth } from "./services/api";

import LeftMenu from "./components/LeftMenu";

const App: React.FC = () => {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [message, setMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Vérifie si l'utilisateur est déjà connecté au montage
  useEffect(() => {
    async function verifyAuth() {
      const isAuthenticated = await checkAuth();
      setIsLoggedIn(isAuthenticated);
      if (isAuthenticated) {
        setMessage("L'utilisateur est déjà connecté.");
      }
    }
    verifyAuth();
  }, []);

  function handleSuccess(successMessage: string) {
    setMessage(successMessage);
    setIsLoggedIn(true); // Passe au chat après connexion
  }

  function handleError(errorMsg: string) {
    setMessage(`Erreur : ${errorMsg}`);
  }

  return (
    <div>
      <LeftMenu />
      <h1>Mon Application</h1>
      {message && <p style={{ color: "green" }}>{message}</p>}
      {isLoggedIn ? (
        <Chat />
      ) : (
        <>
          <div style={{ marginBottom: 20 }}>
            {mode === "login" ? (
              <LoginForm onSuccess={handleSuccess} onError={handleError} />
            ) : (
              <RegisterForm onSuccess={handleSuccess} onError={handleError} />
            )}
          </div>
          <div>
            {mode === "login" ? (
              <p>
                Pas de compte ?{" "}
                <button onClick={() => setMode("register")}>S'inscrire</button>
              </p>
            ) : (
              <p>
                Déjà un compte ?{" "}
                <button onClick={() => setMode("login")}>Se connecter</button>
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default App;
