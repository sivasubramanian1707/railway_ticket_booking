import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

const UserRoute = () => {
  const auth = useSelector((state) => state.auth);
  console.log("UserRoute auth state:", auth.token); // Debugging log

  return auth.token ? <Outlet /> : <Navigate to="/login" />;
};

export default UserRoute;
