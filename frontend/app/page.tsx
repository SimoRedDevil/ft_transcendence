'use client';
import React, { useEffect } from 'react';
import Link from 'next/link'
import axios from 'axios'
import { useRouter } from 'next/navigation';
import {UserContext} from "../components/context/usercontext";
import { useContext } from "react";
import { getCookies, logout} from '../components/auth';


export default function Home() {
    const router = useRouter();
    const {setIsAuthenticated, fetchAuthUser, setauthUser} = useContext(UserContext);

    return (
        <div
        className="
          flex
          flex-col
          w-full
          justify-center
          items-center
          h-screen
          text-white"
      >
        <input type="file" name="file" id="file" />
        <button
          onClick={async () => {
            const fileInput = document.getElementById('file') as HTMLInputElement;
            if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
              alert('Please select a file first!');
              return;
            }
  
            const file = fileInput.files[0];
            const formData = new FormData();
            formData.append('file', file);
  
            try {
                const cookies = await getCookies();
                const csrfToken = cookies.cookies.csrftoken;
              const response = await axios.post('http://localhost:8000/api/auth/upload/', formData, {
                headers: {
                  'Content-Type': 'multipart/form-data',
                    'X-CSRFToken': csrfToken,
                },
              });
  
              console.log('Uploaded file URL:', response.data.url);
            } catch (error) {
            }
          }}
        >
          Upload
        </button>
      </div>
    )
}
