
import axios from "axios";

const BASE_URL = process.env.BASE_URL

const getProfile = async () => {
  
    const headers = { Authorization: localStorage.getItem('token') };
    return await axios
      .get(BASE_URL + "api/user/current", { headers })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log("============= RESPONSE ERROR =============")
        // Handle errors
        if (error.response) {
            // The request was made and the server responded with a status code
            // Get the status code from the error response
            const statusCode = error.response.status;
            // Get the data from the error response body
            const errorData = error.response.data;
            console.log('Error status code:', statusCode);
            console.log('Error data:', errorData);
            return { statusCode, errorData };
        } else if (error.request) {
            // The request was made but no response was received
            console.error('No response received:', error.request);
            return { statusCode: null, errorData: 'No response received' };
        } else {
            // Something happened in setting up the request that triggered an error
            console.error('Request setup error:', error.message);
            return { statusCode: null, errorData: error.message };
        }
      });
};


const UserService = {
    getProfile,
}

export default UserService;