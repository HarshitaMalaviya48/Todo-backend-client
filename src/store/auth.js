import { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    return window.localStorage.getItem("token") || "";
  });
  const [isLoggedIn, setIsLoggedIn] = useState(!!token);
  const [userprofilePicture, setUserprofilePicture] = useState(() => {
    return window.localStorage.getItem("profile");
  });

  const storeTokenInLS = (token) => {
    setToken(token)
  };

  const storeProfileInLS = (profileurl) => {
   setUserprofilePicture(profileurl);
  };

  useEffect(() => {
    if (userprofilePicture) {
      window.localStorage.setItem("profile", userprofilePicture);
    } else {
      window.localStorage.removeItem("profile");
    }
  }, [userprofilePicture]);

  useEffect(() => {
    if (token) {
      setIsLoggedIn(true);
      window.localStorage.setItem("token", token);
    } else {
      window.localStorage.removeItem("token");
      setIsLoggedIn(false);
    }
  }, [token]);

  const logoutUser = () => {
    setToken("");
    window.localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider
      value={{
        storeTokenInLS,
        logoutUser,
        isLoggedIn,
        setIsLoggedIn,
        token,
        setToken,
        storeProfileInLS,
        userprofilePicture,
        setUserprofilePicture,
        
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const AuthConsumer = () => {
  return useContext(AuthContext);
};
