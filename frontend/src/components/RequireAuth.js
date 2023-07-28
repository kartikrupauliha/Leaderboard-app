// * Created this component as a wraper component, which protect its children (Routes) when the user is not authenticated.

import { useLocation, Navigate, Outlet } from "react-router-dom";
import AuthContext from "../context/AuthProvider";
import { useContext } from "react";

const RequireAuth = () => {
  const { token } = useContext(AuthContext);
  const location = useLocation();

  return token ? (
    <Outlet />
  ) : (
    <Navigate to="/" state={{ from: location }} replace />
  );
};

export default RequireAuth;
