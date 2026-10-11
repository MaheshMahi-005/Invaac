import { useState,useEffect } from "react";
import * as authApi from '../api/auth';
import {AuthContext} from './auth-context'

export function AuthProvider({children}){
    const [user,setUser] = useState(null);
    const [loading,setLoading] = useState(()=> !!localStorage.getItem('access_token'));


    useEffect(()=>{
        const token = localStorage.getItem('access_token');
        if (!token){
            return;
        }
        authApi.getMe()
        .then((data) => setUser(data))
        .catch(()=>{
            localStorage.removeItem('access_token');
            setUser(null);
        })
        .finally(()=>setLoading(false));   
    },[]);


    async function loginUser(username,password){
        const {access_token} = await authApi.login(username,password);
        localStorage.setItem('access_token',access_token);
        const me = await authApi.getMe();
        setUser(me);
        return me;
    }
    async function registerUser(username,password){
        return authApi.register(username,password);
    }
    function logout(){
        localStorage.removeItem('access_token');
        setUser(null);
    }
    const value = {
        user, 
        isAuthenticated:!!user,
        isAdmin:user?.role === 'admin',
        loading,
        loginUser,
        registerUser,
        logout
    };
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

