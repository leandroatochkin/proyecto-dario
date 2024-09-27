import React from 'react'
import { motion } from 'framer-motion'
import Backdrop from './Backdrop'
import style from './ShoppingCartModal.module.css'
import { dropIn } from '../common_functions'


const ShoppingCartModal = ({setFunction, buttonText1, buttonText2, itemsToMap, renderItem, handleRemove, buyFunction, language}) => {

//     example usage for renderItem: renderItem={(product)=>(
//       <div className={style.li}>
//       <img src={`../../../public/images/${product.PD_ubi_imagen}`} className={style.listImage}/>
//       <div className={style.scInfo}>
//       <span className={style.h2}>{product.PD_des_pro}</span>
//       <span className={style.h2}>{product.PD_pre_ven}</span>
//       <span className={style.h2}>{ES_text.quantity}:{product.quantity}</span>
//       </div>
//     </div>
//   )}



  return (
    <Backdrop>
    <motion.div 
    className={style.messageContainer}
    variants={dropIn}
    initial='hidden'
    animate='visible'
    exit='exit'
    >
        {itemsToMap.length > 0 ? itemsToMap.map((item, index)=>(
            <div key={index} className={style.item}>

                <div className={style.itemInfo}>
                {renderItem(item)}
                </div>
                <button 
                onClick={()=>handleRemove(index)}
                className={style.removeItem}
                >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                </button>
            </div>
            
        )) :
        <div className={style.noItems}>
            {language.empty_shopping_cart}
        </div>
        
            
        
        }
        <div className={style.buttonsContainer}>
        <button 
        onClick={() => setFunction()} 
        className={style.button1}>{buttonText1}</button>
        <button onClick={() => {
            buyFunction(itemsToMap)
            setFunction()
        }} 
        className={style.button2} 
        disabled={itemsToMap.length === 0}>{buttonText2}</button>
        </div>
    </motion.div>
</Backdrop>
  )
}

export default ShoppingCartModal