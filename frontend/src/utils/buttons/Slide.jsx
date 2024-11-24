import React from 'react';
import style from './Slide.module.css';
import { Motorcycle, Footprints, SliderIcon } from '../svg_icons';
import { UIStore } from '../store';

const Slide = () => {
  const setNeedsDelivery = UIStore((state) => state.setNeedsDelivery);
  const needsDelivery = UIStore((state) => state.needsDelivery);

  const handleChange = () => {
    setNeedsDelivery(!needsDelivery); // Toggle the state
  };

  return (
    <div className={style.btnContainer} role="group" aria-label="Delivery mode selector">
      <Motorcycle aria-hidden="true" focusable="false" />
      <div
        className={`${style.slide} ${needsDelivery ? style['slide-start'] : style['slide-end']}`}
        onClick={handleChange}
        role="button"
        tabIndex="0"
        aria-pressed={needsDelivery}
        aria-label={needsDelivery ? "Currently set to Delivery" : "Currently set to Pickup"}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleChange();
          }
        }}
      >
        <div className={style.slider} aria-hidden="true" focusable="false">
          <SliderIcon />
        </div>
      </div>
      <Footprints aria-hidden="true" focusable="false" />
    </div>
  );
};

export default Slide;
