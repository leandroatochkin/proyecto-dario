import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Backdrop from './Backdrop';
import style from './CloseModal.module.css';
import { dropIn } from '../common_functions';

const ClosedModal = ({setFunction, language, schedule}) => {


  const handleClick = () => {
    setFunction(false); // Close the modal
  };

  console.log(schedule)

  return (
    <Backdrop>
      <motion.div className={style.messageContainer}>
        <h1 className={style.message}>{language.closed_business}</h1>
        <img src='/public/images/clock.png' className={style.image}/>
        <button onClick={handleClick} className={style.button}>
          {'ok'}
        </button>
      </motion.div>
    </Backdrop>
  );
};

export default ClosedModal;
