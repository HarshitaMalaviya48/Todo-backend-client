import React, { useEffect, useRef } from "react";
import { AuthConsumer } from "../store/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Logout() {
  console.log("In logout page");
  
  let iscalled = useRef(false);
  const navigate = useNavigate();
  const { logoutUser, token } = AuthConsumer();
  useEffect(() => {
    if (iscalled.current) return;
    iscalled.current = true;
    const isConfirmed = window.confirm("Do you want to logout");
    if (!isConfirmed) {
      navigate(-1);
      return;
    }
    const callLogoutApi = async () => {
      console.log("in loout api");
      
      const response = await fetch("http://localhost:3001/auth/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const res_data = await response.json();
      if (response.status === 200) {
        toast.success(res_data.message);
        logoutUser();
        navigate("/login");
      }else if(response.status === 400){
        toast.error(res_data.error);
        navigate("/login");
      }
    };

      callLogoutApi();
  }, [token, logoutUser, navigate]);
}

export default Logout;
