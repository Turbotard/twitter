import React, { useState } from "react";
import { register } from "../services/api";

interface RegisterFormProps {
  onSuccess: (data: { message: string }) => void;
  onError: (message: string) => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess, onError }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const data = await register(username, password);
      onSuccess(data);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      onError(err.message);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", maxWidth: 300 }}>
      <h2>Register</h2>
      <label>
        Username:
        <input value={username} onChange={e => setUsername(e.target.value)} required />
      </label>
      <label>
        Password:
        <input value={password} onChange={e => setPassword(e.target.value)} type="password" required />
      </label>
      <button type="submit">S'inscrire</button>
    </form>
  );
};

export default RegisterForm;
