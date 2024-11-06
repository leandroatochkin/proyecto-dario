import React from 'react'
import Backdrop from './Backdrop'
import style from './DiscountsModal.module.css'
import {motion} from  'framer-motion'



const DiscountsModal = ({language, products, setFunction, seeMoreFunction}) => {

const host = import.meta.env.VITE_BACKEND_HOST || 'https://localhost:3000'

  return (
    <Backdrop>
        <button className={style.closeButton}>{language.button_close}</button>
        <div className={style.container}>  
            <div className={style.header}>
            <h2 className={style.headerText}>{language.highlighted_discounts}</h2>
            <img src='/public/images/orange_arrow.png' className={style.arrow}/>
            </div>

            {
                products && products.map((product, index) => {
                    return (
                        <div 
                        key={index}
                        className={style.product}
                        style={{backgroundImage:  `url(${host}/images/${product.PD_img_discount})`}}>

                        

                            <h1 className={style.productTitle}>{product.PD_des_pro}</h1>
            
                            <motion.button
                            initial={{ scale: '1' }}
                            whileTap={{ scale: '0.95' }}
                            onClick={()=>seeMoreFunction(product)}
                            className={style.button}
                            >{language.see_more}</motion.button>
                        </div>
                            )
                })
            }
        </div>
        <p className={style.lowerP}>Image by rawpixel.com</p>
    </Backdrop>
  )
}

export default DiscountsModal