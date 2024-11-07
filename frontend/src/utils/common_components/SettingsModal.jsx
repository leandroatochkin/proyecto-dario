import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Backdrop from './Backdrop';
import style from './SettingsModal.module.css';
import { deleteUser } from '../db_functions';
import ModalOneButton from './ModalOneButton';
import userStore from '../store';
import MotionButton from '../buttons/MotionButton';

const SettingsModal = ({language, setFunction}) => {
const[openErrorModal, setOpenErrorModal] =  useState(false);

const userId = userStore((state)=>state.userId)



const  navigate = useNavigate();



const handleDeleteUser = (userId)  => {
    try{
        deleteUser(userId)
        navigate('/login')
    }catch(e){
        console.log(e);
        setOpenErrorModal(true)
    }
 }


  return (
    <Backdrop>
        {openErrorModal && 
        (
            <ModalOneButton 
            message={language.error_try_again_later}
            setFunction={setOpenErrorModal}
            buttonText={'ok'}
            />
        )
        }
        <motion.div
        className={style.messageContainer}
        >
            <h1 className={style.message}>{language.delete_account}</h1>
            <div className={style.buttonContainer}>
            <MotionButton buttonText={language.cancel} onClick={()=>setFunction(false)} className={style.button}/>
            <MotionButton buttonText={language.delete_account_button} onClick={()=>handleDeleteUser(userId)} className={style.button}/>
            </div>
        </motion.div>
    </Backdrop>
  )
}

export default SettingsModal