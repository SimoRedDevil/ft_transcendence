import axios from "axios";
import { useEffect } from "react";
import { useRouter } from 'next/navigation';

const auth42Intra = () => {
    const API_URL = 'http://localhost:8000/api/auth/42'; // Adjust to your backend URL
    const router = useRouter();
    // Function to initiate login with 42 API
    const loginWith42 = () => {
      // Redirect user to the Django login endpoint
      window.location.href = `${API_URL}/login/`;
    };
    
    // Function to handle the callback after login
    const handle42Callback = async (code) => {
      try {
        const response = await axios.get(`${API_URL}/callback/`, {
          params: { code }, // Query parameter handled by Axios
        });
    
        // Access the response data
        const data = response.data;
        console.log('Authentication successful:', data);
    
        return data; // This should include the tokens and user info
      } catch (error) {
        // Enhanced error logging
        if (error.response) {
          console.error('Server responded with an error:', error.response.data);
        } else if (error.request) {
          console.error('No response received from server:', error.request);
        } else {
          console.error('Error during request setup:', error.message);
        }
        throw error;
      }
    };
  
    useEffect(() => {
      // Capture the code from the URL parameters
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
    
      // If the code exists, process it
      if (code) {
        // Handle the 42 callback with the code
        handle42Callback(code)
          .then((data) => {
            console.log('User authenticated:', data);
            alert('Successfully authenticated with 42!');
    
            // Redirect to dashboard after successful authentication
            router.push('/game');
          })
          .catch((error) => {
            console.error('Failed to authenticate:', error);
            alert('Failed to authenticate with 42');
          });
      }
    }, [router]); // Include `router` in the dependency array
};

export default auth42Intra;