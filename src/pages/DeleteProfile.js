import React, { useEffect, useRef } from 'react'
import { AuthConsumer } from '../store/auth'
import {toast} from "react-toastify";
import { useNavigate } from 'react-router-dom';

function DeleteProfile() {
    let called = useRef(false);
    const {token, setToken, setIsLoggedIn, setUserprofilePicture} = AuthConsumer();
    const navigate = useNavigate();
    useEffect(() => {
        if (called.current) return;
        called.current = true;
        const deleteUser = async () => {
            const isConfirmed = window.confirm("Do you want to Delete Profile");
            if (!isConfirmed) {
                navigate(-1)
                return;
            }
            const response = await fetch("http://localhost:3001/user/delete", {
                method: "DELETE",
                headers:{
                    'Authorization': `Bearer ${token}`
                }
            })
            const res_data = await response.json();
            console.log("In delete user page",response);
            console.log("In delete user page",res_data);
            
            if(response.status === 200){
                console.log("Top in delete success");
                
                setToken("");
                setUserprofilePicture("");
                setIsLoggedIn(false);
                toast.success(res_data.message);
                
                navigate("/register");
                console.log("Bottom in delete success");
            }else if(response.status === 404){
                toast.error(res_data.message);
            }else if(response.status === 401){
                toast.error(res_data.error);
                setToken("");
                setIsLoggedIn(false);
                navigate("/register");
            }else if(response.status === 409){
                toast.error(res_data.error)
                navigate("/todos")
            }
        }
        deleteUser();
    }, [token, setIsLoggedIn, setToken, setUserprofilePicture, navigate])
  return (
   <></> 
  )
}

export default DeleteProfile