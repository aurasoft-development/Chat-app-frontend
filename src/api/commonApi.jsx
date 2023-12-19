// Importing React and axios for making API requests
import axios from "axios";


// Creating an axios instance with the API base URL
const api = axios.create({
  baseURL: `${process.env.REACT_APP_URL}`
})
// Common function to make api request
const commonApiRequest = async (method, url, data = null, headers = {}) => {
  try {

    // Adding headers to the request using interceptors
    api.interceptors.request.use((config) => {
      config.headers = { ...config.headers, ...headers };
      return config;
    });

    // Checking for internet connection
    if (!navigator.onLine) {
      throw new Error('Internet connection issue. Please check your connection.');
    }

    // Making the API request and getting the response
    const response = await api[method](url, data);
    return response;
  } catch (error) {

    // Handling different types of errors
    if (error.response) {
      console.error('Request error:', error?.response?.data);
    }
    else if (error.request) {
      console.error('No response received :', error.request);
    } else {
      console.error('Request setup error: ', error.message);
    }

    // Throwing the error for further handling
    throw error;
  }
};

// Exporting the commonApiRequest function
export default commonApiRequest;
