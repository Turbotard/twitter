// import React, { useState } from "react";
// import LoginForm from "./components/LoginForm";
// import RegisterForm from "./components/RegisterForm";
import SendFriendRequest from "./SendFriendRequest";

function App() {
  return(
    SendFriendRequest()
  )
}

// const App: React.FC = () => {
  // SendFriendRequest()
  // const [mode, setMode] = useState<"login" | "register">("login");
  // const [message, setMessage] = useState("");

  // function handleSuccess(successMessage: string) {
  //   setMessage(successMessage);
  // }

  // function handleError(errorMsg: string) {
  //   setMessage(`Erreur : ${errorMsg}`);
  // }

  // return (
  //   <div style={{ fontFamily: "sans-serif", padding: 20 }}>
  //     <h1>Mon Application</h1>
  //     {message && <p style={{ color: "green" }}>{message}</p>}
  //     <div style={{ marginBottom: 20 }}>
  //       {mode === "login" ? (
  //         <LoginForm onSuccess={handleSuccess} onError={handleError} />
  //       ) : (
  //         <RegisterForm onSuccess={handleSuccess} onError={handleError} />
  //       )}
  //     </div>
  //     <div>
  //       {mode === "login" ? (
  //         <p>
  //           Pas de compte ?{" "}
  //           <button onClick={() => setMode("register")}>S'inscrire</button>
  //         </p>
  //       ) : (
  //         <p>
  //           Déjà un compte ?{" "}
  //           <button onClick={() => setMode("login")}>Se connecter</button>
  //         </p>
  //       )}
  //     </div>
  //   </div>
  // );
// };

export default App;
