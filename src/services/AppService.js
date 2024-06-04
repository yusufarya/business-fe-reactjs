import axios from "axios";
import { useNavigate } from "react-router-dom";

const BASE_URL = 'http://127.0.0.1:3001/';

const serviceGet = async (path, params = {}, navigate) => {
    const headers = { 
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('token')
    };
    return await axios
      .get(BASE_URL + path, { headers, params })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log("============= RESPONSE ERROR =============");
        if (error.response) {
            const statusCode = error.response.status;
            const errorData = error.response.data;
            console.log('Error status code:', statusCode);
            console.log('Error data:', errorData);
            return { statusCode, errorData };
        } else if (error.request) {
            console.error('No response received:', error.request);
            return { statusCode: null, errorData: 'No response received' };
        } else {
            console.error('Request setup error:', error.message);
            return { statusCode: null, errorData: error.message };
        }
    });
};

const ServicePost = async (path, params = {}, navigate) => {
    const headers = { 
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('token') 
    };
    return await axios
    .post(BASE_URL + path, params, { headers })
    .then((response) => {
        console.log("============= RESPONSE SUCCESS =============");
        return {statusCode: response.status, message: response.data};
    })
    .catch((error) => {
        console.log("============= RESPONSE ERROR =============");
        if (error.response) {
            const statusCode = error.response.status;
            const errorData = error.response.data;
            console.log('Error status code:', statusCode);
            console.log('Error data:', errorData);
            return { statusCode, errorData };
        } else if (error.request) {
            console.error('No response received:', error.request);
            return { statusCode: null, errorData: 'No response received' };
        } else {
            console.error('Request setup error:', error.message);
            return { statusCode: null, errorData: error.message };
        }
    });
};

const ServicePut = async (path, params = {}, navigate) => {
    const headers = { 
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('token') 
    };
    return await axios
      .put(BASE_URL + path, params, { headers })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log(error.response.data);
        const statusCode = error.response.status;
        if (statusCode === 401) {
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        }
        return error.response.data;
      });
};

const ServicePatch = async (path, params = {}, navigate) => {
    const headers = { 
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('token') 
    };
    return await axios
    .patch(BASE_URL + path, params, { headers })
    .then((response) => {
        console.log("============= RESPONSE SUCCESS =============");
        return {statusCode: response.status, message: response.data};
    })
    .catch((error) => {
        console.log("============= RESPONSE ERROR =============");
        if (error.response) {
            const statusCode = error.response.status;
            const errorData = error.response.data;
            console.log('Error status code:', statusCode);
            console.log('Error data:', errorData);
            return { statusCode, errorData };
        } else if (error.request) {
            console.error('No response received:', error.request);
            return { statusCode: null, errorData: 'No response received' };
        } else {
            console.error('Request setup error:', error.message);
            return { statusCode: null, errorData: error.message };
        }
    });
};

const serviceDelete = async (path, params, navigate) => {
    const headers = { 
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('token') 
    };
    return await axios
    .delete(BASE_URL + path, { headers, data: params })
    .then((response) => {
        console.log("============= RESPONSE SUCCESS =============");
        return {statusCode: response.status, message: response.data};
    })
    .catch((error) => {
        console.log("============= RESPONSE ERROR =============");
        if (error.response) {
            const statusCode = error.response.status;
            const errorData = error.response.data;
            console.log('Error status code:', statusCode);
            console.log('Error data:', errorData);
            return { statusCode, errorData };
        } else if (error.request) {
            console.error('No response received:', error.request);
            return { statusCode: null, errorData: 'No response received' };
        } else {
            console.error('Request setup error:', error.message);
            return { statusCode: null, errorData: error.message };
        }
    });
};

const ServiceUploadImagePost = async (path, formData, navigate) => {
    const headers = {
        'Content-Type': 'multipart/form-data',
        Authorization: localStorage.getItem('token'),
    };

    try {
        const response = await axios.post(BASE_URL + path, formData, { headers });
        console.log("============= RESPONSE SUCCESS =============");
        return { statusCode: response.status, message: response.data };
    } catch (error) {
        console.log("============= RESPONSE ERROR =============");
        if (error.response) {
            const statusCode = error.response.status;
            const errorData = error.response.data;
            console.log('Error status code:', statusCode);
            console.log('Error data:', errorData);
            return { statusCode, errorData };
        } else if (error.request) {
            console.error('No response received:', error.request);
            return { statusCode: null, errorData: 'No response received' };
        } else {
            console.error('Request setup error:', error.message);
            return { statusCode: null, errorData: error.message };
        }
    }
};

const AppService = {
    serviceGet,
    ServicePost,
    ServicePut,
    ServicePatch,
    serviceDelete,
    ServiceUploadImagePost
};

export default AppService;
