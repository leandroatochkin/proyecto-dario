import React, { useState, useEffect } from 'react';
import style from './login.module.css';
import ModalOneButton from '../../utils/common_components/ModalOneButton';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { ES_text } from '../../utils/text_scripts';
import { handleResponse, handleCheck } from '../../utils/async_functions';




const Login = () => {


const errorMsg = () => console.log('error')

const navigate =  useNavigate()
const [openModal, setOpenModal] = useState(false)
const [data, setData]  = useState({})
const [newUser, setNewUser] = useState(true)

const [phone, setPhone] = useState('')


useEffect(()=>{console.log(newUser)},[newUser])

const decodeResponse = async(response) => {
setData(response)
handleCheck(data.credential, setNewUser)

    if(newUser){
        setOpenModal(true)
        handleResponse(data.credential, phone, setNewUser)
    }
    
    
        
    
    
}



  return (
    <div className={style.container} aria-label="Login container">
    {openModal && <ModalOneButton message={ES_text.phone_modal} setFunction={setOpenModal} buttonText={ES_text.button_enter} state={setPhone}/>}
      <div className={style.login} aria-label="Login form">
        <div className={style.title} aria-label="Welcome Back!"><h3 className={style.h3}>Welcome Back!</h3></div>
        <div className={style.loginBtnContainer} aria-label="Google login button container">
          <GoogleLogin
            onSuccess={decodeResponse}
            onError={errorMsg}
            scope="https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email"
            aria-label="Google login button"
          />
        </div>
      </div>    
      {/* {openModal && <TOSmodal deny_acceptFunction={deny_acceptFunction} />}
      {openErrorModal && <SimpleMessage message="Incorrect email or password" setFunction={setOpenErrorModal} />} */}
    </div>
  );
};

export default Login;
