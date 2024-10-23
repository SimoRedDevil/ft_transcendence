import React, { useState, useEffect } from "react";
import axios from "axios";


export const enableTwoFactorAuth = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/auth/enable-2fa/",
        {
          withCredentials: true, // Ensure cookies are included in the request
        }
      );
      return response.data; // Return response data if needed
    } catch (error) {
      // Handle error
      console.error("Error enabling 2FA:", error);
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
      // Handle error
      console.error("Error disabling 2FA:", error);
      return null;
    }
  };

  