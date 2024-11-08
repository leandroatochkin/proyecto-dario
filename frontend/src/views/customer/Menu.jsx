import React, { useEffect, useState, Suspense } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ItemView from './ItemView';
import { getCategories, getProducts, createCheckout, getBusinessesNumber, getBusinessesDetails } from '../../utils/db_functions';
import style from './Menu.module.css';
import { capitalize, returnDiscount } from '../../utils/common_functions';
import { motion } from 'framer-motion';
import ShoppingCartModal from '../../utils/common_components/ShoppingCartModal';
import { MoonLoader } from 'react-spinners';
import {userStore} from '../../utils/store';
import LargeScreenNotice from '../../utils/common_components/LargeScreenNotice';
import ModalTwoButton from '../../utils/common_components/ModalTwoButtons';
import ModalOneButton from '../../utils/common_components/ModalOneButton';
import SettingsModal from '../../utils/common_components/SettingsModal';
import ClosedModal from '../../utils/common_components/ClosedModal';
import DiscountsModal from '../../utils/common_components/DiscountsModal';
import { host } from '../../utils/index';
import BackArrow from '../../utils/Icons/BackArrow';
import LogOut from '../../utils/Icons/LogOut';
import Settings from '../../utils/Icons/Settings';
import ShoppingCart from '../../utils/Icons/ShoppingCart';
import MotionButton from '../../utils/buttons/MotionButton';

const Menu = ({ setCurrentOrder, currentOrder, language, codRazSoc, isOpen, schedule, businessName }) => {
  const [categories, setCategories] = useState([]);
  const [openBuyModal, setOpenBuyModal] = useState(false);
  const [openCartModal, setOpenCartModal] = useState(false);
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [openErrorModal, setOpenErrorModal] = useState(false);
  const [openLogOutModal, setOpenLogOutModal] = useState(false);
  const [openSettingsModal, setOpenSettingsModal] = useState(false)
  const [openClosedModal, setOpenClosedModal] = useState(false)
  const [accept, setAccept] = useState(false)
  const [hasDelivery, setHasDelivery] = useState(null)
  const [openDiscountModal, setOpenDiscountModal] = useState(true)
  const [discountProducts, setDiscountProducts] = useState([])
  


  const location = useLocation();
  const { razSoc } = location.state || {}
  const {businessNameFromLogIn} =  location.state || {}




  useEffect(() => {
    const retrieveBusinessDetails = async () => {
      try {
        const businessDetails = await getBusinessesDetails(razSoc || codRazSoc);
        setHasDelivery(businessDetails[0].EM_delivery);
      } catch (e) {
        console.log(e);
      }
    };
  
    retrieveBusinessDetails();
  }, []);
  




  const setLoginStatus = userStore((state) => state.setLoginStatus)
  const loginStatus = userStore((state) => state.loggedIn)

  const navigate = useNavigate()

  useEffect(()=>{
    isOpen ? setOpenClosedModal(false) :  setOpenClosedModal(true)
  },[])

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const fetchedCat = await getCategories(razSoc? razSoc : codRazSoc);
        const fetchedProd = await getProducts(razSoc? razSoc : codRazSoc);
        setCategories(fetchedCat);
        setProducts(fetchedProd)
        setDiscountProducts(fetchedProd.filter(product => product.PD_est === 'S'));;
      } catch (e) {
        console.log(e);
        setOpenErrorModal(true)
      }
      setIsLoading(false);
    };
    fetchData();
  }, [razSoc]);
    // Now this runs whenever razSoc changes
  
  const handleBuy = (userId, order, address, total, receptor, commentary) => {

    createCheckout(userId, order, address, total, receptor, commentary);
    setCurrentOrder([]);
  };

  const handleRemove = (index) => {
    setCurrentOrder(currentOrder.filter((_, i) => i !== index));
  };

  const handleLogOut = () => {
    setOpenLogOutModal(true); // Open the logout confirmation modal
  };
  
  const confirmLogOut = () => {
    localStorage.removeItem('authToken');
    setLoginStatus(false, null);
    navigate('/');
  };
  
  const handleAccept = (value) => {
    setAccept(value); // Set the value of accept based on user's choice
    if (value) {
      confirmLogOut(); // If accepted, proceed with logout
    }
  };

  const handleBack = () => {
    setCurrentOrder([])
    navigate('/home')
  }

  const handleDiscountModal = (product) => {
    setOpenDiscountModal(false)
    setProduct(product)
    setOpenBuyModal(true)
  }
  return (
    <div className={style.background}>
      <LargeScreenNotice />
      {openClosedModal && (<ClosedModal setFunction={setOpenClosedModal} language={language} schedule={schedule}/>)}
      {discountProducts.length > 0 && !openClosedModal && openDiscountModal && (<DiscountsModal language={language} products={discountProducts} setFunction={setOpenDiscountModal} seeMoreFunction={handleDiscountModal}/>)}
      {openLogOutModal && (
        <ModalTwoButton message={language.log_out} setOpenModal={setOpenLogOutModal} setAccept={handleAccept} buttonText1={'ok'} buttonText2={'cancelar'}/>
      )}
      {openErrorModal && (
                <ModalOneButton
                    message={language.error_try_again_later}
                    setFunction={setOpenErrorModal}
                    buttonText={'ok'}
                />
      )}
      {openSettingsModal && (
        <SettingsModal language={language} setFunction={setOpenSettingsModal}/>
      )}
      <div className={style.container}>
      {loginStatus ? (<Suspense fallback={<MoonLoader color="#fff" />}>
        {openBuyModal && (
          <ItemView
            product={product}
            setOpenBuyModal={setOpenBuyModal}
            setCurrentOrder={setCurrentOrder}
            language={language}
          />
        )}
        {openCartModal && (
          <ShoppingCartModal
            setFunction={setOpenCartModal}
            buttonText1={language.button_close}
            buttonText2={language.button_buy}
            itemsToMap={currentOrder}
            renderItem={(product) => (
              <div className={style.li}>
                <img src={`${host}/images/${product.PD_ubi_imagen}`} className={style.listImage} />
                <div className={style.scInfo}>
                  <div className={style.liInfo}>
                  <span className={style.h2}>{capitalize(product.PD_des_pro).length > 20 ? capitalize(product.PD_des_pro).slice(0, 20) + '...' :  capitalize(product.PD_des_pro)}</span>
                  <span className={style.h2}>{product.PD_pre_ven}</span>

                  </div>
                  <span className={style.h2}>{language.quantity}:{product.quantity}</span>
                </div>
              </div>
            )}
            handleRemove={handleRemove}
            buyFunction={handleBuy}
            language={language}
            hasDelivery={Number(hasDelivery)}
          />
        )}

        <div className={style.topBtnContainer}>
          <MotionButton buttonText={<BackArrow />} onClick={handleBack} className={style.backBtn}/>
          <MotionButton buttonText={<LogOut />} onClick={handleLogOut} className={style.logOutBtn}/>
          <MotionButton buttonText={<Settings />} onClick={() => setOpenSettingsModal(true)} className={style.settingsBtn}/>
        </div>
        <motion.button
  className={style.cartButton}
  onClick={() => setOpenCartModal(!openCartModal)}
  initial={{ scale: '1' }}
  whileTap={{ scale: '0.95' }}
>
  <ShoppingCart />
  <div className={style.itemCount}>{currentOrder.length}</div>
        </motion.button>
  <h1 className={ categories.length > 0 ? style.businessTitle : style.businessTitleHidden}>{businessName || businessNameFromLogIn}</h1>
        {/* Show loading animation if data is still being fetched */}
        {isLoading ? (
          <div className={style.loader}>
            <MoonLoader color="red" size={60} />
          </div>
        ) : (
          // Display categories and products after loading completes
          categories.length > 0 ? (
          categories.map((category, index) => (
            <div key={index}>
              <h2 className={style.h2Rubro}>{category.RB_des_rub}</h2>
              <ul className={style.ul}>
                {products &&
                  products
                    .filter((product) => product.PD_cod_rub === category.RB_cod_rub)
                    .map((product, index) => (
                      <motion.li
                      initial={{ scale: '1' }}
                        whileTap={{ scale: '0.95' }}
                        key={index}
                        className={style.li}
                        style={product.PD_est === 'B' ? {display: 'none'} : {display: 'flex'}}
                        onClick={() => {
                          if(isOpen){
                          setOpenBuyModal(true);
                          setProduct(product);
                          } else {
                            setOpenClosedModal(true)
                          }
                          
                        }}
                      >
                        <img
                          src={`${host}/images/${product.PD_ubi_imagen}`}
                          className={style.listImage}
                        />
                        <div className={style.itemInfo}>
                          <h3 className={style.h3}>
                            {capitalize(product.PD_des_pro.length > 29 ? product.PD_des_pro.slice(0, 20) + '...' : product.PD_des_pro)}
                          </h3>
                              <p className={product.PD_est === 'A' ? style.p : style.pDiscount} name='offer'><span className={product.PD_est === 'A' ? style.hidden : style.oldPrice}><span style={{fontWeight: 'bolder'}}>oferta! </span> <span className={style.crossedText}>{product.PD_pre_ven/10000}</span></span><span></span>{product.PD_discount === '00' ? product.PD_pre_ven / 10000 : returnDiscount(product.PD_pre_ven, product.PD_discount) / 10000}</p>
                            </div>
                      </motion.li>
                    ))}
              </ul>
            </div>
          ))) : (
            <div className={style.emptyDataContainer}>
              <img src='/images/404-error.png' className={style.emptyLogo}/>
              <a href="https://www.freepik.com/icon/404-error_2431561#fromView=search&page=1&position=23&uuid=77337db2-b66f-4709-bb54-b36d22c844d1">Icon by Good Ware</a>
              <h3>{language.no_data_yet}</h3>
            </div>
          )
        )}
      </Suspense>) : (
        <div className={style.notLogged}>{language.please_log_in}</div>
      )}
      
      </div>
    </div>
  );
};

export default Menu;
