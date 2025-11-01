import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import type { AxiosError } from "axios";
export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const auth = useAuth();
  const nav = useNavigate();
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await auth.register(email, password);
      console.log(email, password);
      nav("/");
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      alert(
        error?.response?.data?.message || error?.message || "Register failed"
      );
    }
  };
  return (
    <form onSubmit={onSubmit}>
      {" "}
      <input
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />{" "}
      <input
        placeholder="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />{" "}
      <button type="submit">Register</button>{" "}
    </form>
  );
}
