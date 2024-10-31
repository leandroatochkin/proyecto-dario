import React, { useState } from 'react';
import { motion } from 'framer-motion';
import style from './QuantityPicker.module.css';

const QuantityPicker = ({ min, max, value, setValue }) => {
  const [disableDec, setDisableDec] = useState(value <= min);
  const [disableInc, setDisableInc] = useState(value >= max);

  const increment = () => {
    const plusState = value + 1;
    if (plusState <= max) {
      setValue(plusState);
      setDisableDec(false);
    }
    if (plusState === max) {
      setDisableInc(true);
    }
  };

  const decrement = () => {
    const minusState = value - 1;
    if (minusState >= min) {
      setValue(minusState);
      if (minusState === min) {
        setDisableDec(true);
      }
    }
    if (minusState < max) {
      setDisableInc(false);
    }
  };

  return (
    <span className={style.container}>
      <motion.button
        className={style.button}
        onClick={decrement}
        disabled={disableDec}
        initial={{ scale: '1' }}
        whileTap={{ scale: '0.95' }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-circle-minus"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M8 12h8" />
        </svg>
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
        initial={{ scale: '1' }}
        whileTap={{ scale: '0.95' }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-circle-plus"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M8 12h8" />
          <path d="M12 8v8" />
        </svg>
      </motion.button>
    </span>
  );
};

export default QuantityPicker;
