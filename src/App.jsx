import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Login from './views/customer/Login'
import Menu from './views/customer/Menu'
import './App.css'
import { ES_text } from './utils/text_scripts'
import {  Route, Routes } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import userStore from './utils/store'

function App() {

  const [currentOrder, setCurrentOrder] = useState([])
  const [language, setLanguage] = useState(ES_text)

  const navigate = useNavigate()
;
  const setLoginStatus = userStore((state) => state.setLoginStatus)

  useEffect(() => {
    // Check if there's a token in localStorage
    const token = localStorage.getItem('authToken');

    if (token) {
      try {
        // Decode the token to get user info (e.g., userId, loggedIn status)
        const decodedToken = jwtDecode(token);
        setLoginStatus(decodedToken.loggedIn, decodedToken.userId)
        // Check token expiration
        const currentTime = Date.now() / 1000; // Convert to seconds
        if (decodedToken.exp < currentTime) {
          // Token has expired, clear it and redirect to login
          localStorage.removeItem('authToken');
          navigate('/login');
        } else {
          // Token is valid, redirect to the menu page
          navigate('/menu');
        }
      } catch (e) {
        console.error('Invalid token', e);
        // Invalid token, remove it from localStorage and redirect to login
        localStorage.removeItem('authToken');
        navigate('/login');
      }
    } else {
      // No token found, redirect to login
      navigate('/login');
    }
  }, [navigate]);


  return (
    <>
      <Routes>

        <Route path="/login" element={<Login />}/> 
        <Route path="/menu" element={<Menu setCurrentOrder={setCurrentOrder} currentOrder={currentOrder} language={language}/>}/>

      </Routes>
        
    </>
  )
}

export default App
