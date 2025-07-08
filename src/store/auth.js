import { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
 
  const storeTokenInLS = (token) => {
    return window.localStorage.setItem("token", token);
  };

  const [token, setToken] = useState(() => {
    return window.localStorage.getItem("token") || "";
  });
  
  const storeProfileInLS = (profileurl) => {
    return window.localStorage.setItem("profile", profileurl)
  }
  const [userprofilePicture, setUserprofilePicture] = useState(() => {
    return window.localStorage.getItem("profile");
  });

  useEffect(() => {
    if(userprofilePicture){
      window.localStorage.setItem("profile", userprofilePicture)
    }
  },[userprofilePicture])
  
  const logoutUser = () => {
    setToken("");
    window.localStorage.removeItem("token");
    setIsLoggedIn(false);
  };
  
  const [isLoggedIn, setIsLoggedIn] = useState(!! token);

  useEffect(() => {
    if(token){
      window.localStorage.setItem("token", token)
      setIsLoggedIn(true);
    }else{
      window.localStorage.removeItem("token");
      setIsLoggedIn(false)
    }
  }, [token])

  return (
    <AuthContext.Provider
      value={{ storeTokenInLS, logoutUser, isLoggedIn, setIsLoggedIn, token, setToken, storeProfileInLS, userprofilePicture, setUserprofilePicture}}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const AuthConsumer = () => {
  return useContext(AuthContext);
};
