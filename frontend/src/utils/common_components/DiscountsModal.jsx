import React from 'react';
import Backdrop from './Backdrop';
import style from './DiscountsModal.module.css';
import { motion } from 'framer-motion';
import {host} from '../../utils/index'

const DiscountsModal = ({ language, products, setFunction, seeMoreFunction }) => {



  return (
    <Backdrop aria-labelledby="discounts-modal">
      <button 
        className={style.closeButton} 
        onClick={() => setFunction(false)} 
        aria-label={language.button_close}
      >
        {language.button_close}
      </button>

      <div className={style.container} role="dialog" aria-labelledby="discounts-modal">
        <div className={style.header}>
          <h2 id="discounts-modal" className={style.headerText}>{language.highlighted_discounts}</h2>
          <img 
            src='/images/orange_arrow.png' 
            className={style.arrow} 
            alt="" 
            aria-hidden="true" 
          />
        </div>

        {products && products.map((product, index) => (
          <div 
            key={index} 
            className={style.product} 
            style={{ backgroundImage: `url(${host}/images/${product.PD_img_discount})` }} 
            role="region" 
            aria-label={`${product.PD_des_pro} discount`}
          >
            <h1 className={style.productTitle} aria-label={product.PD_des_pro}>
              {product.PD_des_pro}
            </h1>

            <motion.button
              initial={{ scale: '1' }}
              whileTap={{ scale: '0.95' }}
              onClick={() => seeMoreFunction(product)}
              className={style.button}
              aria-label={`${language.see_more} ${product.PD_des_pro}`}
            >
              {language.see_more}
            </motion.button>
          </div>
        ))}

        <p className={style.lowerP} aria-label="Image credit">Image by rawpixel.com</p>
      </div>
    </Backdrop>
  );
}

export default DiscountsModal;
