import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { motion } from 'framer-motion';

const CustomGoogleLoginBtn = ({ handleGoogleLoginRegister, setIsGoogleLogin, setContinueBtn }) => {
  const login = useGoogleLogin({
    onSuccess: async tokenResponse => {
      try {
        const userInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
          },
        });
        const userData = await userInfo.json();
 // This will include the user's email and profile info

        // Optionally, call handleGoogleLoginRegister with user data
        handleGoogleLoginRegister(userData.email);
        setContinueBtn(true)
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    },
    onError: error => {
      console.error(error);
    },
    scope: "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email",
  });

  return (
    <motion.button 
      onClick={() => { login(); }}
      initial={{ scale: 1 }}
      whileTap={{ scale: 0.95 }}
      type="button"
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        gap: '10px',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: '0.5rem 1rem',
        borderRadius: '5px',
        border: '1px solid #ddd',
        cursor: 'pointer'
      }}
    >
      <img src='/public/images/google (1).png' alt="Google icon" style={{ height: '1.5rem', width: '1.5rem' }} />
      <span>Google Login</span>
    </motion.button>
  );
};

export default CustomGoogleLoginBtn;
