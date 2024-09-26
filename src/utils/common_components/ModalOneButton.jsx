import React from 'react'
import { motion } from 'framer-motion'
import Backdrop from './Backdrop'
import style from './ModalOneButton.module.css'
import { dropIn } from '../common_functions'



const ModalOneButton = ({message, setFunction, buttonText}) => {
  return (
<Backdrop>
    <motion.div 
    className={style.messageContainer}
    variants={dropIn}
    initial='hidden'
    animate='visible'
    exit='exit'
    >
        <h1>{message}</h1>
        <button onClick={() => setFunction(false)} className={style.button}>{buttonText}</button>
    </motion.div>
</Backdrop>
  )
}

export default ModalOneButton
