import axios from "axios";
import { createContext, ReactNode, useContext, useState } from "react";

type AuthContextType = {
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const api = axios.create({
  baseURL: "https://wolfit-1.onrender.com/api/v1",
  headers: { "Content-Type": "application/json" },
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  async function login(email: string, password: string) {
    try {
      const response = await api.post("/sessions", { email, password });
      console.log("Login bem-sucedido:", response.data);
      setIsLoggedIn(true);
    } catch (error: any) {
      console.error("Erro no login:", error.response?.data || error.message);
    }
  }

  async function register(username: string, email: string, password: string) {
    try {
      const response = await api.post("/users", {
        username,
        email,
        password,
      });
      console.log("Cadastro bem-sucedido:", response.data);
      setIsLoggedIn(true);
    } catch (error: any) {
      console.error(
        "Erro ao cadastrar:",
        error.response?.data || error.message
      );
    }
  }

  function logout() {
    setIsLoggedIn(false);
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return context;
}
