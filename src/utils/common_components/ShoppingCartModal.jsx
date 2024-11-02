import React, {useEffect, useState} from 'react'
import { motion } from 'framer-motion'
import Backdrop from './Backdrop'
import style from './ShoppingCartModal.module.css'
import { dropIn } from '../common_functions'
import AddressSelector from './AddressSelector'
import { ES_text } from '../text_scripts'
import userStore from '../store'


const ShoppingCartModal = ({setFunction, buttonText1, buttonText2, itemsToMap, renderItem, handleRemove, buyFunction, language }) => {

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



const [selectedAddress, setSelectedAddress] = useState(null);
const [total, setTotal] = useState(0)
const [receptor, setReceptor] = useState('')
const [comentary, setCommentary] = useState('')
const [inputWrong, setInputWrong] = useState(false)


const userId = userStore((state) => state.userId);


useEffect(()=>{
const total = itemsToMap.reduce((acc, item) => acc + item.quantity * item.PD_pre_ven, 0).toFixed(4);
setTotal(total)
},[itemsToMap])

const handleBtn = () => {
    if(receptor !== '' && selectedAddress !==  null){
        buyFunction(userId, itemsToMap, selectedAddress, total, receptor, comentary)
        setFunction()
    } else {
        setInputWrong(true) 
        if(selectedAddress === null){
            alert(language.please_select_address)
        } else {
            alert(language.please_enter_name)
        }
        
    }
  
}



  return (
    <Backdrop>
    <motion.div 
    className={style.messageContainer}
    variants={dropIn}
    initial='hidden'
    animate='visible'
    exit='exit'
    >   
 <div className={style.itemInfo}>  
        {itemsToMap.length > 0 ? itemsToMap.map((item, index)=>(
            <div className={style.itemContainer} key={index}>
                <div className={style.itemLine}>
                <div  className={style.item}>
                    {renderItem(item)}
                </div>
                <button 
                onClick={()=>handleRemove(index)}
                className={style.removeItem}
                >
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2">
  <path d="M3 6h18" />
  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
  <line x1="10" y1="11" x2="10" y2="17" />
  <line x1="14" y1="11" x2="14" y2="17" />
</svg>
                </button>
                </div>
            </div>
            
        )) :
        <div className={style.noItems}>
            {language.empty_shopping_cart}
        </div>       
        }
</div>
        <AddressSelector buttonText1={language.add_address} language={language} setSelectedAddress={setSelectedAddress} selectedAddress={selectedAddress}/>
        <div className={style.inputContainer}>
        <label htmlFor='receptor' 
        className={style.label}
        >{language.receptor_input}</label>
        <input name='receptor'
         onChange={(e)=>{
            setInputWrong(false)
            setReceptor(e.target.value)}}
         required={true}
         className={inputWrong ? style.inputWrong : style.input}
         maxLength={'20'}
        />
        </div>
        <div className={style.inputContainer}>
        <label htmlFor='commentary' 
        className={style.label}
        >{language.commentary_input}</label>
        <input className={style.input} type='textarea' name='commentary' placeholder={language.commentary_input_example} onChange={(e)=>setCommentary(e.target.value)} maxLength={50}/>
        </div>


        <div className={style.buttonsContainer}>
          
        <div className={style.totalText}>
            {ES_text.total + ': '}<span style={{fontWeight: 'bolder'}}>{'$' + total}</span>
        </div>
        
        <button 
        onClick={() => setFunction()} 
        className={style.button1}>{buttonText1}</button>
        <button onClick={handleBtn} 
        className={style.button2} 
        disabled={itemsToMap.length === 0}>{buttonText2}</button>
        </div>
    </motion.div>
</Backdrop>
  )
}

export default ShoppingCartModal