
import React, { useState } from 'react';
import axios from 'axios'; // Import Axios library
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilLockLocked, cilUser } from '@coreui/icons';
import { setIsLoggedIn } from '../../../redux/actions/loginActions'; // Import the action

const BASE_URL = process.env.BASE_URL

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isLoggedIn = useSelector((state) => state.isLoggedIn);
	console.log(isLoggedIn)
  
  const [flashSuccess, setFlashSuccess] = useState('');
  const [flashError, setFlashError] = useState('');
  const [validationError, setValidationError] = useState([]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Extract form data
    const formData = new FormData(event.target);
    const username = formData.get('username');
    const password = formData.get('password');
    
    const userData = {
      username: username,
      password: password,
    };
    
    setValidationError([]);

    if (!username) {
      setValidationError(prevErrors => [
        ...prevErrors,  
        {
          "code": "too_small",
          "minimum": 1,
          "type": "string",
          "inclusive": true,
          "exact": false,
          "message": "Please enter your username",
          "path": ["username"]
        },
      ]);
    }

    if (!password) {
      setValidationError(prevErrors => [
        ...prevErrors,  
        {
          "code": "too_small",
          "minimum": 1,
          "type": "string",
          "inclusive": true,
          "exact": false,
          "message": "Please enter your password",
          "path": ["password"]
        },
      ]);
    }

    setFlashSuccess('');
    setFlashError('');

    if (username && password) {  
      try {
        // Send form data to server using Axios
        const response = await axios.post(BASE_URL + 'api/user/login', userData);
        const token = response.data.data.token;
        localStorage.setItem('token', token);
        const loginStatus = { status: 'success', message: "OK" };
        // localStorage.setItem('isLoggedIn', JSON.stringify(loginStatus)); // Save to local storage
        dispatch(setIsLoggedIn(loginStatus)); // Dispatch the action
        setFlashSuccess("Login successfully.");
        setTimeout(() => {
          navigate('/');
        }, 3500);
      } catch (error) {
        setFlashError(error.response.data.errors);
        
        if (error.response.data.error.issues.length) {
          setValidationError(error.response.data.error.issues);
        }
      }
    }
  };

  const getUsernameFromErrors = (errors) => {
    return errors.some(error => error.path.includes('username')) 
    ? errors.find(error => error.path.includes('username')).message
    : null;
  };
  
  const usernameError = getUsernameFromErrors(validationError);

  const getPasswordFromErrors = (errors) => {
    return errors.some(error => error.path.includes('password')) 
    ? errors.find(error => error.path.includes('password')).message
    : null;
  };

  const passwordError = getPasswordFromErrors(validationError);
  
  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={handleSubmit}>
                    <h1>Login</h1>
                    {flashSuccess && 
                      <p className="alert alert-success py-2">{flashSuccess}</p>
                    }
                    {flashError && 
                      <p className="alert alert-danger py-2">{flashError}</p>
                    }
                    <p className="text-body-secondary">Sign In to your account</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput placeholder="Username" name='username' autoComplete="username" />
                      {usernameError &&
                        <small style={{ color: 'red', display: 'block', width: '100%', fontSize: '12px' }}>
                        {usernameError}
                        </small>
                      }
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        name="password"
                        placeholder="Password"
                        autoComplete="current-password"
                      />
                      {passwordError &&
                        <small style={{ color: 'red', display: 'block', width: '100%', fontSize: '12px' }}>
                        {passwordError}
                        </small>
                      }
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <CButton type='submit' color="primary" className="px-4">
                        Login
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-right">
                        <CButton color="link" className="px-0">
                        Forgot password?
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>Sign up</h2>
                    <p>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                    tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                    <Link to="/register">
                    <CButton color="primary" className="mt-3" active tabIndex={-1}>
                      Register Now!
                    </CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default Login;
