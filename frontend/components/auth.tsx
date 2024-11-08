import axios from 'axios';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { UserContext } from './context/usercontext';
const API_URL = 'http://localhost:8000/api/auth/42'; // Adjust to your backend URL


export const getCookies = async () => {
    try {
        const response = await axios.get('http://localhost:8000/api/auth/cookies/', {
            withCredentials: true,
        });
        const cookies = response.data;
        return cookies;
    } catch (error) {
    }
};


