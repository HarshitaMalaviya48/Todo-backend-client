import React from 'react'
import { AuthConsumer } from '../store/auth'
import { Outlet, Navigate } from 'react-router-dom';

function ProtectedRoutes() {
 const {token, isLoggedIn} = AuthConsumer();
 
 return (
    (token && isLoggedIn === true) ? <Outlet/> : <Navigate to="/login" />
 )
}

export function ProtectedLoginSignupRoutes() {
    const {token, isLoggedIn} = AuthConsumer();

    return (
        (token && isLoggedIn === true) ? <Navigate to="/" /> : <Outlet />
    )
} 

export default ProtectedRoutes 