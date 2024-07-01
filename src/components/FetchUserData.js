import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/actions/userActions';
import UserService from '../services/UserService'; // Adjust the path as needed
import Language from '../utils/language';
import { useLocation, useNavigate } from 'react-router-dom';
import { setIsLoggedIn } from '../redux/actions/loginActions';

const FetchUserData = ({ setIsPageDisabled, isLoggedIn }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentLocation = useLocation().pathname

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await UserService.getProfile(); // Assuming UserService.getProfile() returns a promise
        if (user.statusCode === 401) {
          if(currentLocation != "/register" && currentLocation != "/login") {
            setIsPageDisabled(true);
            dispatch(setIsLoggedIn({ status: 'failed', message: Language().UNAUTHORIZED }))
            // dispatch({ type: 'SET_IS_LOGGED_IN', isLoggedIn: false });
            setTimeout(() => {
                setIsPageDisabled(false);
                navigate('/login');
            }, 3000);
          }
        } else if (user.statusCode != 401) {
            const loginStatus = { status: 'success', message: "OK" };
            dispatch(setIsLoggedIn(loginStatus)); // Dispatch the action
            dispatch(setUserData(user.data)); // Dispatch the action to set user data
        } else if(user.statusCode == null) {
          setIsPageDisabled(true);
          dispatch(setIsLoggedIn({ status: 'failed', message: 'Server Error' }))
        }
      } catch (error) {
        setIsPageDisabled(true);
        dispatch(setIsLoggedIn({ status: 'failed', message: 'Server Error' }))
        console.error('Error fetching user data:', error);
      }
    };

    fetchData();
  }, [dispatch, setIsPageDisabled, navigate]);

  return null;
};

export default FetchUserData;
