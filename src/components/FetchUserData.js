import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/actions/userActions';
import UserService from '../services/UserService'; // Adjust the path as needed
import Language from '../utils/language';
import { useNavigate } from 'react-router-dom';
import { setIsLoggedIn } from '../redux/actions/loginActions';

const FetchUserData = ({ setIsPageDisabled, isLoggedIn }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await UserService.getProfile(); // Assuming UserService.getProfile() returns a promise
        if (user.statusCode === 401) {
            setIsPageDisabled(true);
            dispatch(setIsLoggedIn({ status: 'failed', message: Language().UNAUTHORIZED }))
            // dispatch({ type: 'SET_IS_LOGGED_IN', isLoggedIn: false });
            setTimeout(() => {
                setIsPageDisabled(false);
                navigate('/login');
            }, 3000);
        } else if (user.statusCode != 401) {
            const loginStatus = { status: 'success', message: "OK" };
            dispatch(setIsLoggedIn(loginStatus)); // Dispatch the action
            dispatch(setUserData(user.data)); // Dispatch the action to set user data
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchData();
  }, [dispatch, setIsPageDisabled, navigate]);

  return null;
};

export default FetchUserData;
