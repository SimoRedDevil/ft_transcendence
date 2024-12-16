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
      </div>
    )
}
