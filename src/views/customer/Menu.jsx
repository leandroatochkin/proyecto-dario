import React, {useEffect, useState} from 'react'
import ItemView from './ItemView'
import { getCategories, getProducts, createCheckout } from '../../utils/db_functions'

const Menu = ({setCurrentOrder, currentOrder}) => {

const [categories, setCategories] = useState([])
const [openBuyModal, setOpenBuyModal] = useState(false)
const [products, setProducts] = useState([])
const [product, setProduct] = useState({})
const [completeOrder, setCompleteOrder]  = useState(false)




useEffect(()=>{
const fetchData = async () => {
 try{
  const fetchedCat = await getCategories()
 const fetchedProd = await getProducts()
 setCategories(fetchedCat)
 setProducts(fetchedProd)
 } catch(e){
  console.log(e)
 }
}
fetchData()

},[])


const handleBuy = (order) => {
  createCheckout(order)
}


return (
  <div>
    {openBuyModal &&  <ItemView product={product} setOpenBuyModal={setOpenBuyModal} setCurrentOrder={setCurrentOrder}/>}

    {categories &&
      categories.map((category, index) => (
        <div key={index} style={{color: 'red'}}>
          {category.RB_des_rub}
          <ul style={{color: 'white'}}>
            {products &&
              products
                .filter((product) => product.PD_cod_rub === category.RB_cod_rub)
                .map((product, index) => (
                  <li key={index} onClick={()=>{
                    setOpenBuyModal(true)
                    setProduct(product)
                    }}>
                    {product.PD_des_pro}
                  </li>
                  
                ))}
          </ul>
        </div>
      ))}
    <button onClick={()=>handleBuy(currentOrder)}>comprar</button>
  </div>
);

}

export default Menu