import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AuthContextType {
  jwt: string | null;
  setJwt: (newJwt: string | null) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [jwt, setJwtState] = useState<string | null>(null);

  const loadJwt = async () => {
    const storedJwt = await AsyncStorage.getItem("jwt");
    setJwtState(storedJwt);
  };

  useEffect(() => {
    loadJwt();
  }, []);

  const setJwt = async (newJwt: string | null) => {
    setJwtState(newJwt);
    if (newJwt) {
      await AsyncStorage.setItem("jwt", newJwt);
    } else {
      await AsyncStorage.removeItem("jwt");
    }
  };

  return (
    <AuthContext.Provider value={{ jwt, setJwt }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easier access to the context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
