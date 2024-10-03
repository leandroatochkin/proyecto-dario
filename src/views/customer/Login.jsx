import React, { useState, useEffect } from 'react';
import style from './login.module.css';
import ModalOneButton from '../../utils/common_components/ModalOneButton';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { ES_text } from '../../utils/text_scripts';
import { handleResponse, handleCheck } from '../../utils/async_functions';
import { checkUser } from '../../utils/db_functions';
import { jwtDecode } from 'jwt-decode';

const Login = () => {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [newUser, setNewUser] = useState(null);
  const [phone, setPhone] = useState('');
  const [data, setData] = useState({});

  const errorMsg = () => console.log('Login error');

  

  const decodeResponse = async (response) => {
    const decodedToken = jwtDecode(response.credential);  // Decode the JWT token
    const email = decodedToken.email;                     // Extract email from the token
  
    try {
      const userExists = await checkUser(email);          // Check if the user exists in the DB
      console.log('User exists:', userExists);            // Log the result for debugging
  
      if (userExists) {
        setNewUser(false);                                // Set newUser to false if user exists
      } else {
        setNewUser(true);
        setOpenModal(true);   
        setData(response)                                 // Set newUser to true if user doesn't exist
      }
    } catch (e) {
      console.error('Error checking user:', e);           // Log errors, if any
    }
  };
  
  
  

  
  useEffect(() => {
    
    if (newUser === true && data.credential && phone) {
        console.log(data, phone)
      console.log('Registering new user with phone:', phone);  // Debugging log
      handleResponse(data.credential, phone, setNewUser);      // Register new user
    }
  }, [data, newUser, phone]);                                        // Trigger this effect when `newUser` or `phone` changes
  
  
  
  return (
    <div className={style.container} aria-label="Login container">
      {openModal && (
        <ModalOneButton
          message={ES_text.phone_modal}
          setFunction={setOpenModal}
          buttonText={ES_text.button_enter}
          stateSetter={setPhone}

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
