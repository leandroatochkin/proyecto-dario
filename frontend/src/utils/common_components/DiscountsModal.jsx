import React, { useState, useEffect, useRef } from 'react';
import Backdrop from './Backdrop';
import style from './DiscountsModal.module.css';
import { motion } from 'framer-motion';
import { host } from '../../utils/index';
import DoubleArrow from '../svg_icons/DoubleArrow';
import { UIStore } from '../store';

const DiscountsModal = ({ products, setFunction, seeMoreFunction, setFixbackground }) => {
  const setGlobalOpenModal = UIStore((state)=>state.setGlobalOpenModal)
  const globalOpenModal = UIStore((state)=>state.globalOpenModal)
  const [isRotated, setIsRotated] = useState(false);
  const containerRef = useRef(null);

  const language = UIStore((state)=>state.language)

  // This useEffect hook listens for scroll events on the discountContainer
  useEffect(() => {
    setFixbackground(true);
  
    const container = containerRef.current;
  
    const handleScroll = () => {
      if (container) {
        const { scrollLeft, scrollWidth, clientWidth } = container;
        // Rotate the arrow when scrolled to the far right
        setIsRotated(scrollLeft + clientWidth >= scrollWidth);
      }
    };
  
    const handleWheel = (event) => {
      if (event.deltaY !== 0) {
        event.preventDefault();
        container.scrollLeft += event.deltaY;
        console.log("Scroll detected: ", event.deltaY);

      }
    };
  
    container.addEventListener('scroll', handleScroll);
    container.addEventListener('wheel', handleWheel);
  
    return () => {
      container.removeEventListener('scroll', handleScroll);
      container.removeEventListener('wheel', handleWheel);
    };
  }, []);
  


  return (
    <Backdrop aria-labelledby="discounts-modal">
      <button
        className={style.closeButton}
        onClick={() => {
          setFunction(false)
          setFixbackground(false)
        }}
        aria-label={language.button_text.button_close}
      >
        {language.button_text.button_close}
      </button>

      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div className={style.header}>
          <h2 id="discounts-modal" className={style.headerText}>
            {language.general_ui_text.highlighted_discounts}
          </h2>
        </div>

        <div
          className={style.container}
          role="dialog"
          aria-labelledby="discounts-modal"
        >
          <div ref={containerRef} className={style.discountContainer}>
            {products &&
              products.map((product, index) => (
                <div
                  key={index}
                  className={style.product}
                  style={{
                    backgroundImage: `url(${host}/images/${product.PD_img_discount})`
                  }}
                  role="region"
                  aria-label={`${product.PD_des_pro} discount`}
                >
                  <h1 className={style.productTitle} aria-label={product.PD_des_pro}>
                    {product.PD_des_pro}
                  </h1>

                  <motion.button
                    initial={{ scale: '1' }}
                    whileTap={{ scale: '0.95' }}
                    onClick={() => {
                      seeMoreFunction(product)
                      setFixbackground(false)
                    }}
                    className={style.button}
                    aria-label={`${language.button_text.see_more} ${product.PD_des_pro}`}
                  >
                    {language.button_text.see_more}
                  </motion.button>
                </div>
              ))}
          </div>
        </div>

        <div className={style.arrowContainer}>
          <motion.div
            animate={{ rotate: isRotated ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <DoubleArrow />
          </motion.div>
        </div>
        <p className={style.lowerP} aria-label="Image credit">Image by rawpixel.com</p>
      </div>
    </Backdrop>
  );
};

export default DiscountsModal;
