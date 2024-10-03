import React, { useState, useEffect } from 'react';
import style from './login.module.css';
import ModalOneButton from '../../utils/common_components/ModalOneButton';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { ES_text } from '../../utils/text_scripts';
import { handleResponse } from '../../utils/async_functions';
import { checkUser } from '../../utils/db_functions';
import { jwtDecode } from 'jwt-decode';
import userStore from '../../utils/store';

const Login = () => {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [newUser, setNewUser] = useState(null);
  const [phone, setPhone] = useState('');
  const [data, setData] = useState({});

  // Zustand store for login status
  const setLoginStatus = userStore((state) => state.setLoginStatus);
   // Move it outside of any function

  const errorMsg = () => console.log('Login error');

  const decodeResponse = async (response) => {
    const decodedToken = jwtDecode(response.credential);  // Decode Google credential
    const email = decodedToken.email;

    try {
      const { exists, userId } = await checkUser(email);  // Check if the user exists
      if (exists) {
        setNewUser(false);
        setLoginStatus(true, userId);  // Set login status directly here
        navigate('/menu');  // Navigate to the menu page
      } else {
        setNewUser(true);
        setOpenModal(true);  // Open modal for phone input if user is new
        setData(response);    // Save response for later registration
      }
    } catch (e) {
      console.error('Error checking user:', e);
    }
  };

  // Handle new user registration once the phone number is provided
  useEffect(() => {
    if (newUser === true && data.credential && phone) {
      console.log('Registering new user with phone:', phone);  // Debugging log
      handleResponse(data.credential, phone, setNewUser, setLoginStatus, navigate);  // Register new user
    }
  }, [data, newUser, phone]);

  return (
    <div className={style.container} aria-label="Login container">
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
          <h3 className={style.h3}>Welcome Back!</h3>
        </div>
        <div className={style.loginBtnContainer} aria-label="Google login button container">
          <GoogleLogin
            onSuccess={decodeResponse}
            onError={errorMsg}
            scope="https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email"
            aria-label="Google login button"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
