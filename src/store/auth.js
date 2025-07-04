import { createContext, useContext } from "react";


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const storeTokenInLS = (token) => {
        return localStorage.setItem("token", token);
    }
  return <AuthContext.Provider value={{storeTokenInLS}}>
    {children}
  </AuthContext.Provider>;
};

export const AuthConsumer = () => {
    return useContext(AuthContext);
}


