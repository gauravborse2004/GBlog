import React, { useState } from 'react'
import { Button } from './ui/button'
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '@/helpers/firebase';
import { RouteIndex } from '@/helpers/RouteName';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import { GoogleLoginFirebase } from '@/store/auth-slice/authSlice';


const GoogleLogin = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleLogin = async () => {

        try {
            const googleResponse = await signInWithPopup(auth, provider)
            const user = googleResponse.user
            const bodyData = {
                name: user.displayName,
                email: user.email,
                avatar: user.photoURL
            }

            const resultAction = await dispatch(GoogleLoginFirebase(bodyData));
            unwrapResult(resultAction);
            navigate(RouteIndex);
        } catch (error) {
            console.error("Signup failed:", error);
        }
    }
    return (
        <Button variant="outline" className="w-full h-10 cursor-pointer lg:text-md shadow-md" onClick={handleLogin} >
            <FcGoogle />
            Continue With Google
        </Button>
    )
}

export default GoogleLogin



