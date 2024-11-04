import axios from 'axios';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { UserContext } from './context/usercontext';
const API_URL = 'http://localhost:8000/api/auth/42'; // Adjust to your backend URL


const caallBack42 = async (callbackCode) => {
  const router = useRouter();
  const { setIsAuthenticated, setUsers } = useContext(UserContext);
  try {
      if (callbackCode) 
      {
          const response = await axios.get(`http://localhost:8000/api/auth/42/callback/?code=${callbackCode}`,
          {
              withCredentials: true
          });
          if (response.status === 200) {
              const user = response.data;
              setUsers(user);
              if (user) {
                  setIsAuthenticated(true);
                  router.push('/');
              }
          }
          return response;
      }
      } catch (error) {
          setIsAuthenticated(false);
          router.push('/login');
      }
  }

export default caallBack42;