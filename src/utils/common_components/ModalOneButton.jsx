import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Backdrop from './Backdrop';
import style from './ModalOneButton.module.css';
import { dropIn } from '../common_functions';

const ModalOneButton = ({ message, setFunction, buttonText, stateSetter, error }) => {
  const [areaCode, setAreaCode] = useState(''); // State for area code
  const [phoneNumber, setPhoneNumber] = useState(''); // State for phone number
  const [inputError, setInputError] = useState(false);
  
  // Regex to validate area code and phone number together
  const areaCodeRegex = /^(?!0)(\d{1,5})$/;
 const phoneNumberRegex = /^(?!15)(\d{1,8})$/;

  const handleAreaCodeChange = (e) => {
    setAreaCode(e.target.value); // Update area code state
  };

  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value); // Update phone number state
  };

  const handleSubmit = () => {
    const fullInput = `${areaCode}${phoneNumber}`; // Combine area code and phone number
    if (areaCodeRegex.test(areaCode) &&  phoneNumberRegex.test(phoneNumber)) {
      stateSetter(fullInput); // Set the combined phone value
      setFunction(false);
    } else {
      setInputError(true);
      alert(error);
    }
  };

  const handleClick = () => {
    setFunction(false); // Close the modal
  };

  return (
    <Backdrop>
      <motion.div className={style.messageContainer}>
        <h1 className={style.message}>{message}</h1>
        {stateSetter && 
        <div className={style.inputContainer}>
          
          <input
            type="text"
            value={areaCode}
            onChange={handleAreaCodeChange}
            placeholder="Area Code"
            className={inputError ? style.inputIncorrect :  style.inputCorrect}
            style={{width: '30%'}}
            name='area'
          />
          <input
            type="text"
            value={phoneNumber}
            onChange={handlePhoneNumberChange}
            placeholder="Phone Number"
            className={inputError ? style.inputIncorrect :  style.inputCorrect}

          />
        </div>
        }
        <button onClick={stateSetter ? handleSubmit : handleClick} className={style.button}>
          {buttonText}
        </button>
      </motion.div>
    </Backdrop>
  );
};

export default ModalOneButton;
