import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function NotFound() {
  const navigate = useNavigate();

  useEffect(() => {
    alert("Route not found");
    navigate(-1);
  }, [navigate]);
  return null;
}

export default NotFound;
