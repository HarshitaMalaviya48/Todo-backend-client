import React, { useEffect } from 'react'
import { AuthConsumer } from '../store/auth'
import {toast} from "react-toastify";
import { redirect, useNavigate } from 'react-router-dom';

function DeleteProfile() {
    let called = false;
    const {token, setToken, setIsLoggedIn} = AuthConsumer();
    const navigate = useNavigate();
     useEffect(() => {
        if(called) return;
        called = true;
        const deleteUser = async () => {
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
                setToken("");
                setIsLoggedIn(false);
                toast.success(res_data.message);
                navigate("/register");
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
    }, [])
  return (
   <></> 
  )
}

export default DeleteProfile