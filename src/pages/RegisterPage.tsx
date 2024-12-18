import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import RegisterForm from "../components/RegisterForm";

const RegisterPage: React.FC = () => {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  function handleRegisterSuccess() {
    setMessage("Inscription réussie! Vous pouvez maintenant vous connecter.");
    setTimeout(() => {
      navigate("/login");
    }, 1500);
  }

  function handleError(errorMsg: string) {
    setMessage(errorMsg);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">TWITTER</h1>
      {message && <p className="text-green-500 text-center mb-4">{message}</p>}
      <div className="max-w-md mx-auto">
        <RegisterForm onSuccess={handleRegisterSuccess} onError={handleError} />
      </div>
    </div>
  );
};

export default RegisterPage;
