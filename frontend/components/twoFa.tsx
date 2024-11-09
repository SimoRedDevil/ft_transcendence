'use client';
import React, { useState, useEffect } from "react";
import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_URL;
export const enableTwoFactorAuth = async (fetchAuthUser) => {
  try {
    const response = await axios.get(
      `${API}/enable-2fa/`,
      {
        withCredentials: true, // Ensure cookies are included in the request
      }
    );
    if (response.status === 200) {
      fetchAuthUser();
    }
  } catch (error) {
    return null;
  }
};

export  const disableTwoFactorAuth = async () => {
    try {
      const response = await axios.get(
        `${API}/disable-2fa/`,
        {
          withCredentials: true, // Ensure cookies are included in the request
        }
      );
      return response.data; // Return response data if needed
    } catch (error) {
      return null;
    }
  };

  export const verify2FA = async (code) => {
    try {
      const response = await axios.get(
        `${API}/verify-2fa/?code=${code}`,
        {
          withCredentials: true, // Ensure cookies are included in the request
        }
      );
      return response.status;
    } catch (error){
    }
  };
