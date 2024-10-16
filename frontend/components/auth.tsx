import axios from 'axios';

const API_URL = 'http://localhost:8000/api/auth/42'; // Adjust to your backend URL

// Function to handle the callback after login
export const handle42Callback = async (code) => {
  try {
    const response = await axios.get(`${API_URL}/callback/`, {
      params: { code }, // Query parameter handled by Axios
    });

    // Access the response data
    const data = response.data;
    return data; // This should include the tokens and user info
  } catch (error) {
    // Enhanced error logging
    if (error.response) {
      //console.error('Server responded with an error:', error.response.data);
    } else if (error.request) {
      //console.error('No response received from server:', error.request);
    } else {
      //console.error('Error during request setup:', error.message);
    }
    throw error;
  }
};
