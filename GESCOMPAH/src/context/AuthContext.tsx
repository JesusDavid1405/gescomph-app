import React, { createContext, useState, ReactNode } from 'react';

// 🔹 Define la interfaz de lo que compartirá el contexto
interface AuthContextType {
  user: any;
  setUser: (user: any) => void;
}

// 🔹 Crea el contexto con valores por defecto
export const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
});

// 🔹 Crea el proveedor
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null); // 👈 por ahora el usuario está vacío

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
