import React, { useState } from "react";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";

const App: React.FC = () => {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [message, setMessage] = useState("");

  function handleLoginSuccess(data: { token: string }) {
    localStorage.setItem("token", data.token);
    setMessage("Connexion réussie!");
  }

  function handleRegisterSuccess() {
    setMessage("Inscription réussie! Vous pouvez maintenant vous connecter.");
    setMode("login");
  }

  function handleError(errorMsg: string) {
    setMessage(errorMsg);
  }

  return (
    <div style={{ fontFamily: "sans-serif", padding: 20 }}>
      <h1>Mon Application</h1>
      {message && <p style={{ color: "green" }}>{message}</p>}
      <div style={{ marginBottom: 20 }}>
        {mode === "login" ? (
          <LoginForm onSuccess={handleLoginSuccess} onError={handleError} />
        ) : (
          <RegisterForm onSuccess={handleRegisterSuccess} onError={handleError} />
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
    </div>
  );
};

export default App;
