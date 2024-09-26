import React, { useState } from 'react';

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
    <span className="quantity-picker">
      <button
        className={`${disableDec ? 'mod-disable ' : ''}quantity-modifier modifier-left`}
        onClick={decrement}
        disabled={disableDec}
        whileHover={{scale: 1.05}}
        whileTap={{scale: 0.95}}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-minus"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/></svg>
      </button>
      <input
        className="quantity-display"
        type="text"
        value={value}
        readOnly
      />
      <button
        className={`${disableInc ? 'mod-disable ' : ''}quantity-modifier modifier-right`}
        onClick={increment}
        disabled={disableInc}
        whileHover={{scale: 1.05}}
        whileTap={{scale: 0.95}}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-plus"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>
      </button>
    </span>
  );
};

export default QuantityPicker;
