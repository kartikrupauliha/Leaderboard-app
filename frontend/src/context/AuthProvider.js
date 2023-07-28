// *Authprovider* , created global state to store login user info globally.

// * Used context api to save the data globally.

import { createContext, useState } from "react";
import { useCookies } from "react-cookie";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [cookies, removeCookie] = useCookies([]);
  const [auth, setAuth] = useState({});
  const [token, settoken] = useState(null);

  return (
    <AuthContext.Provider value={{ auth, setAuth, token, settoken }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
