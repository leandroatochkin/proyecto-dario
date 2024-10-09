import React, { useEffect, useState, Suspense } from 'react';
import ItemView from './ItemView';
import { getCategories, getProducts, createCheckout } from '../../utils/db_functions';
import style from './Menu.module.css';
import { capitalize } from '../../utils/common_functions';
import { motion } from 'framer-motion';
import ShoppingCartModal from '../../utils/common_components/ShoppingCartModal';
import { MoonLoader } from 'react-spinners';

const Menu = ({ setCurrentOrder, currentOrder, language }) => {
  const [categories, setCategories] = useState([]);
  const [openBuyModal, setOpenBuyModal] = useState(false);
  const [openCartModal, setOpenCartModal] = useState(false);
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState({});
  const [isLoading, setIsLoading] = useState(true);  // New loading state

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);  // Set loading to true before starting fetch
      try {
        const fetchedCat = await getCategories();
        const fetchedProd = await getProducts();
        setCategories(fetchedCat);
        setProducts(fetchedProd);
      } catch (e) {
        console.log(e);
      }
      setIsLoading(false);  // Set loading to false after fetch completes
    };
    fetchData();
  }, []);

  const handleBuy = (userId, order, address, total) => {
    createCheckout(userId, order, address, total);
    setCurrentOrder([]);
  };

  const handleRemove = (index) => {
    setCurrentOrder(currentOrder.filter((_, i) => i !== index));
  };

  return (
    <div className={style.background}>
      <Suspense fallback={<MoonLoader color="#fff" />}>
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
                <img src={`http://localhost:3000/images/${product.PD_ubi_imagen}`} className={style.listImage} />
                <div className={style.scInfo}>
                  <span className={style.h2}>{product.PD_des_pro}</span>
                  <span className={style.h2}>{product.PD_pre_ven}</span>
                  <span className={style.h2}>{language.quantity}:{product.quantity}</span>
                </div>
              </div>
            )}
            handleRemove={handleRemove}
            buyFunction={handleBuy}
            language={language}
          />
        )}

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
                          src={`http://localhost:3000/images/${product.PD_ubi_imagen}`}
                          className={style.listImage}
                        />
                        <div className={style.itemInfo}>
                          <h3 className={style.h3}>
                            {capitalize(product.PD_des_pro.length > 29 ? product.PD_des_pro.slice(0, 30) + '...' : product.PD_des_pro)}
                          </h3>
                          <p className={style.p}>{product.PD_pre_ven.slice(0, product.PD_pre_ven.length - 2)}</p>
                        </div>
                      </motion.li>
                    ))}
              </ul>
            </div>
          ))
        )}
      </Suspense>
    </div>
  );
};

export default Menu;
