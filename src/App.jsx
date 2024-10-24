import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Login from './views/customer/Login';
import Menu from './views/customer/Menu';
import Home from './views/customer/Home';
import './App.css';
import { ES_text } from './utils/text_scripts';
import { Route, Routes } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import userStore from './utils/store';
import { googleLogout } from '@react-oauth/google';

function App() {
   const [currentOrder, setCurrentOrder] = useState([])
    const [isLoading, setIsLoading] = useState(true); // Add loading state
    const [razSoc, setRazSoc] = useState('');
    const [language, setLanguage] = useState(ES_text);

    

    const navigate = useNavigate();
    const setLoginStatus = userStore((state) => state.setLoginStatus);
    const loginStatus = userStore((state) => state.loginStatus);

    useEffect(() => {
        const token = localStorage.getItem('authToken');

        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                setLoginStatus(true, decodedToken.userId);

                const currentTime = Date.now() / 1000; // Convert to seconds
                if (decodedToken.exp < currentTime) {
                    // Token has expired, clear it and redirect to login
                    localStorage.removeItem('authToken');
                    navigate('/login');
                } 
                // else {
                //     // Token is valid, navigate to home
                //     navigate('/');
                // }
            } catch (e) {
                console.error('Invalid token', e);
                localStorage.removeItem('authToken');
                navigate('/login');
            }
        } else {
            // No token found, redirect to login
            navigate('/login');
        }
        setIsLoading(false); // Update loading state after check
    }, [navigate, setLoginStatus]);

    // Render loading state or routes based on isLoading
    if (isLoading) {
        return <div>Loading...</div>; // Optional loading indicator
    }

    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Home setRazSoc={setRazSoc} razSoc={razSoc} language={language}/>} />
            <Route path="/menu" element={<Menu setCurrentOrder={setCurrentOrder} currentOrder={currentOrder} language={language} razSoc={razSoc} />} />
        </Routes>
    );
}

export default App;
