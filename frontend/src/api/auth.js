import axios from "axios";
import api from './axios';

const API_URL = import.meta.env.VITE_API_URL;

export async function login(username,password){
    const body = new URLSearchParams();
    body.append('username',username);
    body.append('password',password);


const res = await axios.post(`${API_URL}/auth/login`,body,{
 headers:{"Content-Type":'application/x-www-form-urlencoded'},
});
return res.data;
}

export async function register(username,password){
    const res = await axios.post(`${API_URL}/auth/register`,{username,password});
    return res.data;
}

export async function getMe(){
    const res = await api.get('/auth/me');
    return res.data;
}