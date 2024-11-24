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
    <div className={style.btnContainer}>
      <Motorcycle />
      <div
  className={`${style.slide} ${needsDelivery ? style['slide-start'] : style['slide-end']}`}
  onClick={handleChange}
>
  <div className={style.slider}>
    <SliderIcon />
  </div>
</div>
      <Footprints />
    </div>
  );
};

export default Slide;
