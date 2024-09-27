import React, { useState } from 'react';
import { motion } from 'framer-motion';
import style from './QuantityPicker.module.css'

const QuantityPicker = ({ min, max, value, setValue}) => {
  const [disableDec, setDisableDec] = useState(true);
  const [disableInc, setDisableInc] = useState(false);

  const increment = () => {
    const plusState = value + 1;
    if (value < max) {
      setValue(plusState);
      setDisableDec(false);
    }
    if (value === max - 1) {
      setDisableInc(true);
    }
    if (value === min) {
      setDisableDec(false);
    }
  };

  const decrement = () => {
    const minusState = value - 1;
    if (value > min) {
      setValue(minusState);
      if (value === min + 1) {
        setDisableDec(true);
      }
    } else {
      setValue(min);
    }
    if (value === max) {
      setDisableInc(false);
    }
  };

  return (
    <span className={style.container}>
      <motion.button
        className={style.button}
        onClick={decrement}
        disabled={disableDec}
        whileHover={{scale: 1.05}}
        whileTap={{scale: 0.95}}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-minus"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/></svg>
      </motion.button>
      <input
        className={style.display}
        type="text"
        value={value}
        readOnly
      />
      <motion.button
        className={style.button}
        onClick={increment}
        disabled={disableInc}
        whileHover={{scale: 1.05}}
        whileTap={{scale: 0.95}}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-plus"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>
      </motion.button>
    </span>
  );
};

export default QuantityPicker;
