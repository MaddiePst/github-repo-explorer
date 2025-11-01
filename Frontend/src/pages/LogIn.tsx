import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import type { AxiosError } from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const auth = useAuth();
  const nav = useNavigate();
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // console.log("LogIn: ", email, password);
    try {
      await auth.login(email, password);
      nav("/");
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      alert(error?.response?.data?.message || error?.message || "Login failed");
    }
  };
  return (
    <form onSubmit={onSubmit}>
      <input
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        placeholder="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Login</button>
    </form>
  );
}
