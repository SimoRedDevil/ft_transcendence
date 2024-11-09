import axios from 'axios';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { UserContext } from './context/usercontext';

const API = process.env.NEXT_PUBLIC_API_URL;
export const getCookies = async () => {
    try {
        const response = await axios.get(`${API}/cookies/`, {
            withCredentials: true,
        });
        const cookies = response.data;
        return cookies;
    } catch (error) {
    }
};


