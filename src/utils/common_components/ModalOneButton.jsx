import React, {useState} from 'react'
import { motion } from 'framer-motion'
import Backdrop from './Backdrop'
import style from './ModalOneButton.module.css'
import { dropIn } from '../common_functions'



const ModalOneButton = ({ message, setFunction, buttonText, stateSetter }) => {
  const [inputValue, setInputValue] = useState('');       // Local state for input value

  const handleInputChange = (e) => {
    setInputValue(e.target.value);                        // Update local state
  };

  const handleSubmit = () => {
    stateSetter(inputValue);                              // Set the `phone` state
    setFunction(false);                                   // Close the modal
  };

  return (
    <Backdrop>
      <motion.div className={style.messageContainer}>
        <h1 className={style.message}>{message}</h1>
        {stateSetter && 
        <div>
        <input type="text" value={inputValue} onChange={handleInputChange} />
      </div>
        }
        <button onClick={stateSetter ? handleSubmit : setFunction(false)} className={style.button}>{buttonText}</button>
      </motion.div>
    </Backdrop>
  );
};

export default ModalOneButton
