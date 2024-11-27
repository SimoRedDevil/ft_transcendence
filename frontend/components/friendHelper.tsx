import { axiosInstance } from '@/utils/axiosInstance';
import { useState } from 'react';

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