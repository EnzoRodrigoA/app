import { authService } from "@/services/mockService"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { createContext, ReactNode, useContext, useEffect, useState } from "react"

type AuthContextType = {
  isLoggedIn: boolean
  login: (email: string, password: string) => Promise<AuthResponse>
  register: (username: string, email: string, password: string) => Promise<AuthResponse>
  token: string | null
  logout: () => void
  loading: boolean
  hasCompletedOnboarding: boolean
  setHasCompletedOnboarding: (value: boolean) => Promise<void>
}

type AuthResponse = {
  success: boolean
  message?: string
  data?: any
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false)

  async function updateOnboarding(value: boolean) {
    setHasCompletedOnboarding(value)
    await AsyncStorage.setItem("hasCompletedOnboarding", value ? "true" : "false")
  }

  useEffect(() => {
    async function loadState() {
      const storedToken = await AsyncStorage.getItem("authToken")
      const storedOnboarding = await AsyncStorage.getItem("hasCompletedOnboarding")

      if (storedToken) {
        setToken(storedToken)
        setIsLoggedIn(true)
      }

      if (storedOnboarding === "true") {
        setHasCompletedOnboarding(true)
      }

      setLoading(false)
    }
    loadState()
  }, [])

  async function login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await authService.login(email, password)

      if (!response.success) {
        return { success: false, message: response.message }
      }

      const mockToken = `mock-token-${Date.now()}`
      setToken(mockToken)
      setIsLoggedIn(true)
      await AsyncStorage.setItem("authToken", mockToken)
      return {
        success: true,
        data: response.user,
        message: "Login realizado com sucesso!"
      }
    } catch (error: any) {
      console.error("Erro no login:", error)
      return { success: false, message: "Falha ao fazer login" }
    }
  }

  async function register(
    username: string,
    email: string,
    password: string
  ): Promise<AuthResponse> {
    try {
      const response = await authService.register(username, email, password)

      if (!response.success) {
        return { success: false, message: response.message }
      }

      return {
        success: true,
        data: response.user,
        message: "Cadastro realizado com sucesso!"
      }
    } catch (error: any) {
      console.error("Erro ao cadastrar:", error)
      return { success: false, message: "Falha ao realizar cadastro" }
    }
  }

  async function logout() {
    setIsLoggedIn(false)
    setToken(null)
    await AsyncStorage.removeItem("authToken")
  }

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
        setHasCompletedOnboarding: updateOnboarding
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider")
  }
  return context
}
