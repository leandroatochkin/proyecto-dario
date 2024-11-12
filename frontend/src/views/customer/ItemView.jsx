import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Backdrop from '../../utils/common_components/Backdrop';
import QuantityPicker from '../../utils/common_components/QuantityPicker';
import { capitalize, dropIn, returnDiscount, returnDiscountDate } from '../../utils/common_functions';
import ModalOneButton from '../../utils/common_components/ModalOneButton';
import style from './ItemView.module.css';
import { host } from '../../utils/index';


const ItemView = ({ product, setCurrentOrder, setOpenBuyModal, language, setFixbackground }) => {
  const [value, setValue] = useState(1);
  const [pushingItem, setPushingItem] = useState({
    PD_cod_raz_soc: product.PD_cod_raz_soc,
    PD_cod_suc: product.PD_cod_suc,
    PD_cod_pro:product.PD_cod_pro,
    PD_des_pro:product.PD_des_pro,
    PD_cod_rub:product.PD_cod_rub,
    PD_pre_ven: product.PD_est === 'X' || 'S' ? returnDiscount(product.PD_pre_ven, product.PD_discount) / 10000 : product.PD_pre_ven/10000,
    PD_ubi_imagen:product.PD_ubi_imagen,
    PD_est:product.PD_est,
    quantity: 1,
  });


  const superOffer =  product.PD_est === 'S' ? true : false

  const [openMsg, setOpenMsg] = useState(false);

  useEffect(() => {
    setPushingItem((prevItem) => ({
      ...prevItem,
      quantity: value,
    }));
  }, [value]);

  const handleClose = () => {
    setOpenBuyModal(false);
    setFixbackground(false)
  };

  const handleBuyBtn = (product) => {
    if (product) {
      setCurrentOrder((prevItems) => {
        // Check if the item is already in the cart
        const existingItemIndex = prevItems.findIndex(item => item.PD_cod_pro === pushingItem.PD_cod_pro);
  
        if (existingItemIndex !== -1) {
          // Item exists, so update the quantity
          const updatedItems = [...prevItems];
          updatedItems[existingItemIndex].quantity += pushingItem.quantity;
          return updatedItems;
        } else {
          // Item does not exist, so add it to the cart
          return [...prevItems, pushingItem];
        }
      });
  
      setOpenMsg(true); // Show confirmation message
    }
  };
  
  const date = returnDiscountDate(product.PD_discount_DATE)

  return (
    <Backdrop
    >
      <motion.div
        className={style.itemView}
        style={superOffer  ? { backgroundImage: `url(${host}/images/${product.PD_img_discount})`, color: '#e0e0e0' } : ''}
        variants={dropIn}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div className={style.modalItemInfo}>
          <p className={product.PD_est === 'S' ? style.discountTag : style.hidden}><span style={{fontWeight: 'bolder'}}>{language.highlighted_discount}</span>{' '}{language.to}{' '}{date}</p>
          <div className={superOffer ? style.closeButtonContainerS : style.closeButtonContainer}>
            <h1 className={style.dialogueTitle} aria-label={`Title: ${product.PD_des_pro}`} style={product.PD_est === 'S'  ? {color: '#e0e0e0'} : {color: '#212427'}}>
              {capitalize(product.PD_des_pro.length < 19 ? product.PD_des_pro : product.PD_des_pro.slice(0, 20) + '...')}
            </h1>
            <motion.button
              className={style.closeFormButton}
              onClick={()=>{
                setFixbackground(false) 
                setOpenBuyModal(false)}
              }
              initial={{ scale: '1' }}
              whileTap={{ scale: '0.95' }}
              style={superOffer ? {color: '#e0e0e0'} : {color: '#212427'}}
              aria-label="Close book details"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-circle-x"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="m15 9-6 6" />
                <path d="m9 9 6 6" />
              </svg>
            </motion.button>
          </div>
          <p className={superOffer ? style.itemModalDescriptionS : style.itemModalDescription} aria-label={`Description: ${product.PD_des_pro}`}>
            {capitalize(product.PD_des_pro.length < 29 ? product.PD_des_pro : product.PD_des_pro.slice(0, 30) + '...')}
          </p>
          
          <p className={ superOffer ? style.totalP : ''}>
            <span style={{ fontWeight: 'bolder' }}>{language.price}:</span> {product.PD_est === 'X' || 'S' ? returnDiscount(product.PD_pre_ven, product.PD_discount) / 10000 : product.PD_pre_ven / 10000}{product.PD_est === 'X' || product.PD_est === 'S' ? '(oferta)' : ''}             
          </p>
          <p>
            <span style={{ fontWeight: 'bolder' }}>{language.quantity}:</span>
          </p>
          <div className="operation-btn-container">
            <div className={style.pickerContainer}>
              <QuantityPicker min={1} max={10} value={value} setValue={setValue} product={product} aria-label="Select quantity" />
            </div>
            <motion.button
              className={style.addToCartBtn}
              initial={{ scale: '1' }}
              whileTap={{ scale: '0.95' }}
              onClick={() => {
                setFixbackground(false)
                handleBuyBtn(product)}}
              //aria-label={`Add ${book.title} to shopping cart`}
            >
             {language.add_to_cart} 
            </motion.button>
          </div>
        </div>
      </motion.div>
      {openMsg && <ModalOneButton message={'Artículo añadido al carrito'} setFunction={setOpenBuyModal} buttonText={'Ok'}/>}
    
    </Backdrop>
  );
};

export default ItemView;
