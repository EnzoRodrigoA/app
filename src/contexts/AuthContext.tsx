import api, { setUnauthorizedHandler } from "@/services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

type AuthContextType = {
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<void>;
  token: string | null;
  logout: () => void;
  loading: boolean;
  hasCompletedOnboarding: boolean;
  setHasCompletedOnboarding: (value: boolean) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  useEffect(() => {
    async function loadState() {
      const storedToken = await AsyncStorage.getItem("authToken");
      const storedOnboarding = await AsyncStorage.getItem(
        "hasCompletedOnboarding"
      );

      if (storedToken) {
        setToken(storedToken);
        setIsLoggedIn(true);
      }

      if (storedOnboarding === "true") {
        setHasCompletedOnboarding(true);
      }

      setLoading(false);
    }
    loadState();
  }, []);

  async function login(email: string, password: string) {
    try {
      const response = await api.post("/sessions", { email, password });
      const userToken = response.data?.token;
      setToken(userToken);
      setIsLoggedIn(true);

      await AsyncStorage.setItem("authToken", userToken);
    } catch (error: any) {
      console.error("Erro no login:", error.response?.data.message);
    }
  }

  async function register(username: string, email: string, password: string) {
    try {
      const response = await api.post("/users", {
        username,
        email,
        password,
      });
      const userToken = response.data.token;
      setToken(userToken);
      setIsLoggedIn(true);
      await AsyncStorage.setItem("authToken", userToken);
    } catch (error: any) {
      console.error(
        "Erro ao cadastrar:",
        error.response?.data || error.message
      );
    }
  }

  async function logout() {
    setIsLoggedIn(false);
    setToken(null);
    await AsyncStorage.removeItem("authToken");
  }

  useEffect(() => {
    setUnauthorizedHandler(logout);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        login,
        logout,
        register,
        token,
        loading,
        hasCompletedOnboarding,
        setHasCompletedOnboarding,
      }}
    >
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
