import { useState, useEffect } from 'react'
import Menu from './views/customer/Menu'
import './App.css'
import { ES_text } from './utils/text_scripts'

function App() {
  const [count, setCount] = useState(0)
  const [currentOrder, setCurrentOrder] = useState([])
  const [language, setLanguage] = useState(ES_text)
  useEffect(()=>{console.log(currentOrder)},[currentOrder])
  return (
    <>
      <div>
        <Menu setCurrentOrder={setCurrentOrder} currentOrder={currentOrder} language={language}/>
        </div>
    </>
  )
}

export default App
