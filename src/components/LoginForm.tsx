import { useEffect, useState } from "react";
import { login } from "../services/api";
import { useNavigate } from "react-router-dom";
import store from "../store/store";

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const updateUserId = store.getState().updateUserId;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const message = await login(username, password);
      console.log("Connexion réussie :", username);
      navigate("/message/611cf330-16c8-428d-ba99-41599339e6fb");
      alert(message)
    } catch (err) {
      if (err instanceof Error) {
        console.error(err.message)
        alert("Mot de passe ou nom d'utilisateur incorrect.")
      } else {
        console.error("Erreur lors de la connexion.");
        alert("Authentification impossible. Veuillez réessayer.")
      }
    }
  };
  
  const navRegister = () => {
    navigate("/register")
  }

  useEffect(() => {
    const userId = localStorage.getItem("connectedUser");
    if (userId) {
      updateUserId(userId);
      navigate(`/message/611cf330-16c8-428d-ba99-41599339e6fb`);
    }
  }, [updateUserId, navigate]);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2>Connexion</h2>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          maxWidth: "300px",
          margin: "0 auto",
        }}
      >
        <input
          type="text"
          placeholder="Nom d'utilisateur"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={{
            padding: "10px",
            fontSize: "16px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            padding: "10px",
            fontSize: "16px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "10px",
            backgroundColor: "#28A745",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Se connecter
        </button>
        <button
          type="submit"
          onClick={navRegister}
          style={{
            padding: "10px",
            backgroundColor: "#28A745",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          S'inscrire
        </button>
      </form>
    </div>
  );
}

export default LoginForm;
