import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LargeScreenNotice from '../../utils/common_components/LargeScreenNotice';
import style from './VerifiedEmail.module.css'
import { verifyEmail } from '../../utils/db_functions';
import { motion } from 'framer-motion';
import MotionButton from '../../utils/buttons/MotionButton';



const VerifiedEmail = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get('id');
    const [verified, setVerified] = useState(false);

    const language = UIStore((state)=>state.language)


    useEffect(()=>{
        try{
            const setVerification = async () => await verifyEmail(id)
            setVerification()
            setVerified(true)
        } catch(e){
            console.log(e);
        }

    },[id])

    const handleClick = () =>{
        if(verified){
            navigate('/login');
        }
        
    }
    


  return (
    <div className={style.container}>
        <LargeScreenNotice />
        <h1>{language.info_messages.thanks_for_verifying}</h1>
        <img src='/public/images/verification.png' className={style.image}/>
        <MotionButton buttonText={'ok'} onClick={handleClick} className={style.button}/>
    </div>
  )
}

export default VerifiedEmail