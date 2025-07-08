import React, { useEffect } from "react";
import { AuthConsumer } from "../store/auth";
import { useNavigate } from "react-router-dom";
import {toast} from "react-toastify";

function Logout() {
  const navigate = useNavigate();
  const { logoutUser, token } = AuthConsumer();
  useEffect(() => {
    const callLogoutApi = async () => {
      const response = await fetch("http://localhost:3001/auth/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const res_data = await response.json();
      toast.success(res_data.message)
    };
    callLogoutApi()
    logoutUser();
    navigate("/login");
  }, [logoutUser]);
}

export default Logout;
