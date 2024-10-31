import React, { useState, useEffect } from 'react';
import style from './login.module.css';
import ModalOneButton from '../../utils/common_components/ModalOneButton';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { ES_text } from '../../utils/text_scripts';
import { handleResponse } from '../../utils/async_functions';
import { checkUser } from '../../utils/db_functions';
import {jwtDecode} from 'jwt-decode';  // Fix the import of jwtDecode
import userStore from '../../utils/store';
import { MoonLoader } from 'react-spinners';  // Import a loader component
import LargeScreenNotice from '../../utils/common_components/LargeScreenNotice';

const Login = () => {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [newUser, setNewUser] = useState(null);
  const [phone, setPhone] = useState('');
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);  // Initial loading state
  const [loginLoading, setLoginLoading] = useState(false);  // Login action loading state

  // Zustand store for login status
  const setLoginStatus = userStore((state) => state.setLoginStatus);

  const errorMsg = () => console.log('Login error');

  const decodeResponse = async (response) => {
    setLoginLoading(true);  // Set loading state to true when starting the login process
    const decodedToken = jwtDecode(response.credential);  // Decode Google credential
    const email = decodedToken.email;

    try {
      const { exists, userId } = await checkUser(email);  // Check if the user exists
      if (exists) {
        setNewUser(false);
        setLoginStatus(true, userId);  // Set login status directly here
        navigate('/');  // Navigate to the menu page
      } else {
        setNewUser(true);
        setOpenModal(true);  // Open modal for phone input if user is new
        setData(response);    // Save response for later registration
      }
    } catch (e) {
      console.error('Error checking user:', e);
    } finally {
      setLoginLoading(false);  // Set login state to false after processing
    }
  };

  // Handle new user registration once the phone number is provided
  useEffect(() => {
    if (newUser === true && data.credential && phone) {
      handleResponse(data.credential, phone, setNewUser, setLoginStatus, navigate);  // Register new user
    }
  }, [data, newUser, phone]);

  // Simulate fetching/loading initial screen data
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);  // Set to false after screen is ready
    }, 1000);  // Delay for showing loader (for demo purposes)
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    // Show initial loader while the screen is loading
    return (
      <div className={style.loaderContainer}>
        <MoonLoader color="#4A90E2" size={50} aria-label="Loading spinner" />
      </div>
    );
  }

  return (
    <div className={style.container} aria-label="Login container">
      <LargeScreenNotice />
      {openModal && (
        <ModalOneButton
          message={ES_text.phone_modal}
          setFunction={setOpenModal}
          buttonText={ES_text.button_enter}
          stateSetter={setPhone}  // This sets the phone number
        />
      )}

      <div className={style.login} aria-label="Login form">
        <div className={style.title} aria-label="Welcome Back!">
          <img src={'/public/images/malbec_logo_transparente.PNG'} className={style.logo}/>
        </div>
        
        {/* Show the loader while the login process is happening */}
        {loginLoading ? (
          <div className={style.loaderContainer}>
            <MoonLoader color="red" size={60} aria-label="Loading spinner" />
          </div>
        ) : (
          <div className={style.loginBtnContainer} aria-label="Google login button container">
            <GoogleLogin
              onSuccess={decodeResponse}
              onError={errorMsg}
              scope="https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email"
              aria-label="Google login button"
            />
          </div>
        )}
      </div>
      <footer className={style.footer}>
        <p>code by <a href='https://github.com/leandroatochkin'>leandroatochkin</a></p>
        <p>logos by <a href='https://www.instagram.com/andres_actis?igsh=dDA5ejYxbmVtOW51'>Andrés Actis</a></p>
      </footer>
    </div>
  );
};

export default Login;
