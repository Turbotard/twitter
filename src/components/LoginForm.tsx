import React, { useState } from "react";
import { login } from "../services/api";

interface LoginFormProps {
  onSuccess: (data: { token: string }) => void;
  onError: (message: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, onError }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const data = await login(username, password);
      onSuccess(data);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      onError(err.message);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", maxWidth: 300 }}>
      <h2>Login</h2>
      <label>
        Username:
        <input value={username} onChange={e => setUsername(e.target.value)} required />
      </label>
      <label>
        Password:
        <input value={password} onChange={e => setPassword(e.target.value)} type="password" required />
      </label>
      <button type="submit">Se connecter</button>
    </form>
  );
};

export default LoginForm;
