import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Backdrop from './Backdrop';
import style from './CloseModal.module.css';
import { dropIn } from '../common_functions';

const ClosedModal = ({setFunction, language, schedule}) => {


  const handleClick = () => {
    setFunction(false); // Close the modal
  };



  return (
    <Backdrop>
      <motion.div className={style.messageContainer}>
        <h1 className={style.message}>{language.closed_business}</h1>
        
        <img src='/public/images/clock.png' className={style.image}/>
        <p className={style.p}><span style={{fontWeight: 'bolder'}}>{language.schedule}:</span>
        {schedule ? schedule.EM_hora_ap.slice(0, -2)+':'+schedule.EM_hora_ap.slice(2, 4)+'hs. - ' + schedule.EM_hora_cierre.slice(0, -2)+':'+schedule.EM_hora_cierre.slice(2, 4) + 'hs.' : ''}</p>

        <button onClick={handleClick} className={style.button}>
          {'ok'}
        </button>
        <a href="https://www.freepik.com/icon/clock_2997985#fromView=search&page=1&position=67&uuid=c84a25dd-1f4a-4116-a196-911857768c78" style={{fontSize: '0.6rem', marginRight: '0'}}>Icon by justicon</a>
      </motion.div>
      
    </Backdrop>
  );
};

export default ClosedModal;
