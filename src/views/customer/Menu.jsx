import React, { useEffect, useState, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import ItemView from './ItemView';
import { getCategories, getProducts, createCheckout } from '../../utils/db_functions';
import style from './Menu.module.css';
import { capitalize } from '../../utils/common_functions';
import { motion } from 'framer-motion';
import ShoppingCartModal from '../../utils/common_components/ShoppingCartModal';
import { MoonLoader } from 'react-spinners';
import userStore from '../../utils/store';
import LargeScreenNotice from '../../utils/common_components/LargeScreenNotice';

const Menu = ({ setCurrentOrder, currentOrder, language, razSoc }) => {
  const [categories, setCategories] = useState([]);
  const [openBuyModal, setOpenBuyModal] = useState(false);
  const [openCartModal, setOpenCartModal] = useState(false);
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  

  const setLoginStatus = userStore((state) => state.setLoginStatus)
  const loginStatus = userStore((state) => state.loggedIn)
  const setError =  userStore((state) => state.setError)

  const navigate = useNavigate()

  useEffect(() => {
    if (!razSoc) return;
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const fetchedCat = await getCategories(razSoc);
        const fetchedProd = await getProducts(razSoc);
        console.log('Categories:', fetchedCat);
        console.log('Products:', fetchedProd);
        setCategories(fetchedCat);
        setProducts(fetchedProd);
      } catch (e) {
        console.log(e);
        setError(true, e);
      }
      setIsLoading(false);
    };
    fetchData();
  }, [razSoc]);
    // Now this runs whenever razSoc changes
  
  const handleBuy = (userId, order, address, total, receptor) => {
    createCheckout(userId, order, address, total, receptor);
    setCurrentOrder([]);
  };

  const handleRemove = (index) => {
    setCurrentOrder(currentOrder.filter((_, i) => i !== index));
  };

  const handleLogOut = () => {
    localStorage.removeItem('authToken')
    setLoginStatus(false, null)
    navigate('/login')
  }

  const handleBack = () => {
    setCurrentOrder([])
    navigate('/')
  }

  useEffect(()=>{console.log(loginStatus)},[])

  return (
    <div className={style.background}>
      <LargeScreenNotice />
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
                <img src={`https://localhost:3000/images/${product.PD_ubi_imagen}`} className={style.listImage} />
                <div className={style.scInfo}>
                  <div className={style.liInfo}>
                  <span className={style.h2}>{capitalize(product.PD_des_pro).length > 20 ? capitalize(product.PD_des_pro).slice(0, 20) + '...' :  capitalize(product.PD_des_pro)}</span>
                  <span className={style.h2}>{product.PD_pre_ven.slice(0, product.PD_pre_ven.length - 3)}</span>
                  </div>
                  <span className={style.h2}>{language.quantity}:{product.quantity}</span>
                </div>
              </div>
            )}
            handleRemove={handleRemove}
            buyFunction={handleBuy}
            language={language}
          />
        )}

        <div className={style.topBtnContainer}>
        <motion.button
        className={style.backBtn}
        whileTap={{ scale: '0.95' }}
        onClick={handleBack}
        >
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-big-left-dash"><path d="M19 15V9"/><path d="M15 15h-3v4l-7-7 7-7v4h3v6z"/></svg>        
        </motion.button>

        <motion.button
        className={style.logOutBtn}
        whileTap={{ scale: '0.95' }}
        onClick={handleLogOut}
        >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-log-out"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
        </motion.button>
        </div>
        <motion.button
          className={style.cartButton}
          onClick={() => setOpenCartModal(!openCartModal)}
          whileTap={{ scale: '0.95' }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-shopping-cart"
          >
            <circle cx="8" cy="21" r="1" />
            <circle cx="19" cy="21" r="1" />
            <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
          </svg>
          <div className={style.itemCount}>{currentOrder.length}</div>
        </motion.button>

        {/* Show loading animation if data is still being fetched */}
        {isLoading ? (
          <div className={style.loader}>
            <MoonLoader color="red" size={60} />
          </div>
        ) : (
          // Display categories and products after loading completes
          categories &&
          categories.map((category, index) => (
            <div key={index}>
              <h2 className={style.h2}>{category.RB_des_rub}</h2>
              <ul className={style.ul}>
                {products &&
                  products
                    .filter((product) => product.PD_cod_rub === category.RB_cod_rub)
                    .map((product, index) => (
                      <motion.li
                        whileTap={{ scale: '0.95' }}
                        key={index}
                        className={style.li}
                        onClick={() => {
                          setOpenBuyModal(true);
                          setProduct(product);
                        }}
                      >
                        <img
                          src={`https://localhost:3000/images/${product.PD_ubi_imagen}`}
                          className={style.listImage}
                        />
                        <div className={style.itemInfo}>
                          <h3 className={style.h3}>
                            {capitalize(product.PD_des_pro.length > 29 ? product.PD_des_pro.slice(0, 20) + '...' : product.PD_des_pro)}
                          </h3>
                          <p className={style.p}>{product.PD_pre_ven.slice(0, product.PD_pre_ven.length - 2)}</p>
                        </div>
                      </motion.li>
                    ))}
              </ul>
            </div>
          ))
        )}
      </Suspense>) : (
        <div className={style.notLogged}>{language.please_log_in}</div>
      )}
      
      </div>
    </div>
  );
};

export default Menu;
