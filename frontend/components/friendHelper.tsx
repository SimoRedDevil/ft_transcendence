import { axiosInstance } from '@/utils/axiosInstance';
import { getCookies } from './auth';
import axios from 'axios';
import { toast } from 'react-toastify';

export const fetchSearchResults = async (
    searchInput: string,
    setSearchResults: (data: any) => void,
    setSearchLoading: (loading: boolean) => void
) => {
    try {
      setSearchLoading(true);
      const res = await axiosInstance.get(`auth/users/`, {
        params: {
          search: searchInput
        }
      });
      setSearchResults(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setSearchLoading(false);
    }
  }
  
  export const handleBlock = async (
    username: string
  ) => {
    const body = {
      username: username
    }
    try {
      const cookies = await getCookies();
      const csrfToken = cookies.cookies.csrftoken;
      const response = await axios.post('http://localhost:8000/api/auth/block/', body, {
        headers: {
          "Content-Type": "application/json",
          'X-CSRFToken': csrfToken,
        },
        withCredentials: true,
      });
      if (response.status === 200) {
        toast.success("User blocked successfully")
      }
    } catch (error) {
      toast.error(error.response.data.error)
    }
  }
