import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Backdrop from '../../utils/common_components/Backdrop';
import QuantityPicker from '../../utils/common_components/QuantityPicker';
import { capitalize, dropIn } from '../../utils/common_functions';
import ModalOneButton from '../../utils/common_components/ModalOneButton';
import style from './ItemView.module.css';


const ItemView = ({ product, setCurrentOrder, setOpenBuyModal, language }) => {
  const [value, setValue] = useState(1);
  const [pushingItem, setPushingItem] = useState({
    PD_cod_raz_soc: product.PD_cod_raz_soc,
    PD_cod_suc: product.PD_cod_suc,
    PD_cod_pro:product.PD_cod_pro,
    PD_des_pro:product.PD_des_pro,
    PD_cod_rub:product.PD_cod_rub,
    PD_pre_ven:product.PD_pre_ven/10000,
    PD_ubi_imagen:product.PD_ubi_imagen,
    PD_est:product.PD_est,
    quantity: 1,
  });

  console.log(pushingItem)

  const [openMsg, setOpenMsg] = useState(false);

  useEffect(() => {
    setPushingItem((prevItem) => ({
      ...prevItem,
      quantity: value,
    }));
  }, [value]);

  const handleClose = () => {
    setOpenBuyModal(false);
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
  


  return (
    <Backdrop>
      <motion.div
        className={style.itemView}
        variants={dropIn}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div
          className={style.modalItemImage}
          //style={{ background: `url(${book.coverImageUrl})`, backgroundSize: 'cover' }}
          //aria-label={`Cover image of ${book.title}`}
        ></div>
        <div className={style.modalItemInfo}>
          <div className={style.closeButtonContainer}>
            <h1 className={style.dialogueTitle} aria-label={`Title: ${product.PD_des_pro}`} style={{color: '#212427'}}>
              {capitalize(product.PD_des_pro.length < 29 ? product.PD_des_pro : product.PD_des_pro.slice(0, 30) + '...')}
            </h1>
            <motion.button
              className={style.closeFormButton}
              onClick={()=>setOpenBuyModal(false)}
              initial={{ scale: '1' }}
              whileTap={{ scale: '0.95' }}
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
          <p className={style.itemModalDescription} aria-label={`Description: ${product.PD_des_pro}`}>
            {capitalize(product.PD_des_pro.length < 29 ? product.PD_des_pro : product.PD_des_pro.slice(0, 30) + '...')}
          </p>
          
          <p>
            <span style={{ fontWeight: 'bolder' }}>{language.price}:</span> {product.PD_pre_ven / 10000}
          </p>
          <p>
            <span style={{ fontWeight: 'bolder' }}>{language.quantity}:</span>
          </p>
          <div className="operation-btn-container">
            <div className={style.pickerContainer}>
              <QuantityPicker min={1} max={10} value={value} setValue={setValue} aria-label="Select quantity" />
            </div>
            <motion.button
              className={style.addToCartBtn}
              initial={{ scale: '1' }}
              whileTap={{ scale: '0.95' }}
              onClick={() => handleBuyBtn(product)}
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
