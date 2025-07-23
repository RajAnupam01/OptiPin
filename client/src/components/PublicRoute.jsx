import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserData } from "../contexts/UserContext";
import { Loading } from "./Loading";

function PublicRoute({ children }) {
  const { isAuth, loading } = UserData();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && isAuth) {
      navigate("/", { replace: true }); 
    }
  }, [isAuth, loading, navigate]);

  return loading ? <Loading /> : children;
}

export default PublicRoute;
