import React from 'react';
import { motion } from 'framer-motion';
import Backdrop from './Backdrop';
import style from './CloseModal.module.css';
import { UIStore } from '../store';


const ClosedModal = ({setFunction, schedule, setFixbackground}) => {
  const setGlobalOpenModal = UIStore((state)=>state.setGlobalOpenModal)
  const globalOpenModal = UIStore((state)=>state.globalOpenModal)


  const handleClick = () => {
    setFunction(false); // Close the modal
    setGlobalOpenModal(false)
    setFixbackground(false)
  };

  const language = UIStore((state)=>state.language)


  return (
    <Backdrop>
      <div className={style.messageContainer}>
        <h1 className={style.message}>{language.info_messages.closed_business}</h1>
        
        <img src='/images/clock.png' className={style.image}/>
        <p className={style.p}><span style={{fontWeight: 'bolder'}}>{language.general_ui_text.schedule}:</span>
        {!schedule.EM_corte ?
         schedule.EM_hora_ap.slice(0, -2)+':'+schedule.EM_hora_ap.slice(2, 4)+'hs. - ' + schedule.EM_hora_cierre.slice(0, -2)+':'+schedule.EM_hora_cierre.slice(2, 4) + 'hs.' 
         : 
         schedule.EM_hora_ap.slice(0, -2)+':'+schedule.EM_hora_ap.slice(2, 4)+'hs. - '+ schedule.EM_corte.slice(0,-6)+':' + schedule.EM_corte.slice(0,-4) + 'hs. y de' + schedule.EM_corte.slice(-4,-2)+':'+schedule.EM_corte.slice(-2)+'hs. - ' + schedule.EM_hora_cierre.slice(0, -2)+':'+schedule.EM_hora_cierre.slice(2, 4) + 'hs.'}</p>

        <motion.button 
        onClick={handleClick} 
        className={style.button}
        initial={{ scale: '1' }}
        whileTap={{ scale: '0.95' }}
        >
          {'ok'}
        </motion.button>
        <a href="https://www.freepik.com/icon/clock_2997985#fromView=search&page=1&position=67&uuid=c84a25dd-1f4a-4116-a196-911857768c78" style={{fontSize: '0.6rem', marginRight: '0'}}>Icon by justicon</a>
      </div>
      
    </Backdrop>
  );
};

export default ClosedModal;
