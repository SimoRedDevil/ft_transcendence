import React, { useState, useEffect } from "react";
import axios from "axios";
import { UserContext } from "../components/context/usercontext";

export const enableTwoFactorAuth = async (fetchAuthUser) => {
  try {
    const response = await axios.get(
      "http://localhost:8000/api/auth/enable-2fa/",
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
        "http://localhost:8000/api/auth/disable-2fa/",
        {
          withCredentials: true, // Ensure cookies are included in the request
        }
      );
      return response.data; // Return response data if needed
    } catch (error) {
      return null;
    }
  };

  