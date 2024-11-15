import React, { useState } from 'react';
import { motion } from 'framer-motion';
import style from './QuantityPicker.module.css';
import PlusIcon from '../svg_icons/PlusIcon';
import MinusIcon from '../svg_icons/MinusIcon';

const QuantityPicker = ({ min, max, value, setValue, product }) => {
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
    <span className={product.PD_est === 'S'  ?  style.offerContainer : style.container}>
      <motion.button
        className={style.button}
        onClick={decrement}
        disabled={disableDec}
        initial={{ scale: '1' }}
        whileTap={{ scale: '0.95' }}
      >
        <MinusIcon />
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
        <PlusIcon />
      </motion.button>
    </span>
  );
};

export default QuantityPicker;
