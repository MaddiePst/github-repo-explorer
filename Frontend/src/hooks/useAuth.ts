import client from "../api/client";
import { useAuthContext } from "../context/authProvider";
import type { User } from "../types";

export function useAuth() {
  const { setUser } = useAuthContext();

  async function login(email: string, password: string) {
    const res = await client.post("/auth/login", { email, password });
    const { token, user } = res.data as { token: string; user: User };
    localStorage.setItem("token", token);
    setUser(user);
    return user;
  }

  async function register(email: string, password: string, name?: string) {
    const res = await client.post("/auth/register", { email, password, name });
    const { token, user } = res.data as { token: string; user: User };
    localStorage.setItem("token", token);
    setUser(user);
    return user;
  }

  function logout() {
    localStorage.removeItem("token");
    setUser(null);
  }

  return { login, register, logout };
}
