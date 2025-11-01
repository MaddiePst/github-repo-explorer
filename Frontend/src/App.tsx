// import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Favorites from "./pages/Favorites";
import Login from "./pages/LogIn";
import Register from "./pages/Register";
import { useAuthContext } from "./context/authProvider";
import type { ReactNode } from "react";

function Protected({ children }: { children: ReactNode }) {
  const { user } = useAuthContext();
  if (!user) return <div className="p-4">Please login to continue.</div>;
  return <>{children}</>;
}

export default function App() {
  const { user, logout } = useAuthContext();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="p-4 bg-white shadow flex justify-between items-center">
        <Link to="/" className="font-bold">
          Repo Explorer
        </Link>
        <div className="space-x-4">
          <Link to="/">Search</Link>
          <Link to="/favorites">Favorites</Link>
          {user ? (
            <>
              <span>{user.email}</span>
              <button onClick={logout} className="ml-2">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </nav>

      <main className="p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/favorites"
            element={
              <Protected>
                <Favorites />
              </Protected>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
    </div>
  );
}
