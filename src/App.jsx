import { useState, useEffect } from 'react'
import Login from './views/customer/Login'
import Menu from './views/customer/Menu'
import './App.css'
import { ES_text } from './utils/text_scripts'
import {  Route, Routes } from 'react-router-dom'

function App() {
  const [count, setCount] = useState(0)
  const [currentOrder, setCurrentOrder] = useState([])
  const [language, setLanguage] = useState(ES_text)
  useEffect(()=>{console.log(currentOrder)},[currentOrder])
  return (
    <>
      <Routes>

        <Route path="/" element={<Login />}/> 
        <Route path="/menu" element={<Menu setCurrentOrder={setCurrentOrder} currentOrder={currentOrder} language={language}/>}/>

      </Routes>
        
    </>
  )
}

export default App
