import React, {useEffect, useState} from 'react'
import { motion } from 'framer-motion'
import Backdrop from './Backdrop'
import style from './ShoppingCartModal.module.css'
import { dropIn } from '../common_functions'
import AddressSelector from './AddressSelector'
import { ES_text } from '../text_scripts'
import userStore from '../store'
import { MoonLoader } from 'react-spinners';
import Trashcan from '../Icons/Trashcan' 
import MotionButton from '../buttons/MotionButton'


const ShoppingCartModal = ({setFunction, buttonText1, buttonText2, itemsToMap, renderItem, handleRemove, buyFunction, language, hasDelivery }) => {

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
const [loading, setLoading] = useState(false)
const [playAnimation, setPlayAnimation] = useState(false)

console.log(selectedAddress)

const userId = userStore((state) => state.userId);

console.log(hasDelivery)
useEffect(()=>{
const total = itemsToMap.reduce((acc, item) => acc + item.quantity * item.PD_pre_ven, 0);
setTotal(total)
const addressToSend = hasDelivery === 0
        ? { address: language.none, type: 2 }
        : selectedAddress;
setSelectedAddress(addressToSend)
},[itemsToMap])

const handleBtn = () => {
    setLoading(true)
    // Set selectedAddress based on delivery status
    const addressToSend = hasDelivery === 0
        ? { address: language.none, type: language.none }
        : selectedAddress;
    setSelectedAddress(addressToSend)
  
    // Check if receptor and address (if delivery is required) are set properly
    if (receptor) {
        buyFunction(
            userId,
            itemsToMap,
            selectedAddress,
            total,
            receptor,
            comentary
        );
        //setFunction(false);
    } else {
        // Trigger wrong input state
        setInputWrong(true);

        // Show appropriate alert based on missing input
        if (!receptor) {
            alert(language.please_enter_name);
        } else if (hasDelivery === 1 && !addressToSend?.address) {
            alert(language.please_select_address);
        }
    }
};

useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      setPlayAnimation(true)
    }, 1000);
    return () => clearTimeout(timer);
  }, [loading]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPlayAnimation(false)
    }, 1000);
    return () => clearTimeout(timer);
  }, [playAnimation]);


  



  return (
    <Backdrop>
    <motion.div 
    className={style.messageContainer}
    variants={dropIn}
    initial='hidden'
    animate='visible'
    exit='exit'
    >
  {
    loading && <MoonLoader color="red" size={60} aria-label="Loading spinner" />
  }
  {
    playAnimation && <div>
        <img src='/images/place_order.gif'/>
        <h3 style={{color: '#212427'}}>{language.order_placed}</h3>
    </div>
  }         
<div className={loading || playAnimation ? style.hidden : style.topContainer}>
<div className={style.itemInfo}>  
        {itemsToMap.length > 0 ? itemsToMap.map((item, index)=>(
            <div className={style.itemContainer} key={index}>
                <div className={style.itemLine}>
                <div  className={style.item}>
                    {renderItem(item)}
                </div>
                <MotionButton buttonText={<Trashcan />} onClick={()=>handleRemove(index)} className={style.removeItem}/>
                </div>
            </div>
            
        )) :
        <div className={style.noItems}>
            {language.empty_shopping_cart}
        </div>       
        }
</div>
        <div style={hasDelivery === 1 ? {display: 'flex'} :  {display: 'none'}}>

        <AddressSelector buttonText1={language.add_address} language={language} setSelectedAddress={setSelectedAddress} selectedAddress={selectedAddress}/>
        </div>
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
        <p className={hasDelivery === 1 ? style.hidden : style.p}>{language.has_not_delivery}</p>

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
        <MotionButton buttonText={buttonText1} onClick={() => setFunction()} className={style.button1}/>
        <MotionButton buttonText={buttonText2} onClick={handleBtn} className={style.button2} disabled = {itemsToMap.length === 0}/>
        </div>
</div>
    </motion.div>
</Backdrop>
  )
}

export default ShoppingCartModal