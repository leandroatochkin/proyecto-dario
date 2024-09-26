import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Menu from './views/customer/Menu'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [currentOrder, setCurrentOrder] = useState([])
  useEffect(()=>{console.log(currentOrder)},[currentOrder])
  return (
    <>
      <div>
        <Menu setCurrentOrder={setCurrentOrder} currentOrder={currentOrder}/>
        </div>
    </>
  )
}

export default App
