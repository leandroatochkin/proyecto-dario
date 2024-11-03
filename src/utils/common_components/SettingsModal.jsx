import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Backdrop from './Backdrop';
import style from './SettingsModal.module.css';
import { deleteUser } from '../db_functions';
import ModalOneButton from './ModalOneButton';
import userStore from '../store';

const SettingsModal = ({language, setFunction}) => {
const[openErrorModal, setOpenErrorModal] =  useState(false);

const userId = userStore((state)=>state.userId)

console.log(userId)

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
            <motion.button
            className={style.button}
            initial={{ scale: '1' }}
            whileTap={{scale: '0.95'}}
            onClick={()=>setFunction(false)}
            >
            {language.cancel}
            </motion.button>
            <motion.button
            className={style.button}
            initial={{ scale: '1' }}
            whileTap={{scale: '0.95'}}
            onClick={()=>handleDeleteUser(userId)}
            >
            {language.delete_account_button}
            </motion.button>
            </div>
        </motion.div>
    </Backdrop>
  )
}

export default SettingsModal