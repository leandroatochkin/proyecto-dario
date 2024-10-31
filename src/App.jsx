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
import { convertTimeToMinutes } from './utils/common_functions';
import { getServerTime } from './utils/async_functions';
import { consoleMsg } from './utils/text_scripts';
import { MoonLoader } from 'react-spinners';

function App() {
    const [currentOrder, setCurrentOrder] = useState([])
    const [isLoading, setIsLoading] = useState(true); // Add loading state
    const [razSoc, setRazSoc] = useState('');
    const [schedule, setSchedule] = useState([])
    const [language, setLanguage] = useState(ES_text);
    const [isOpen, setIsOpen] = useState(true)
    const [timeOffset, setTimeOffset] = useState(0);

    useEffect(()=>console.log(consoleMsg),[])

    const navigate = useNavigate();
    const setLoginStatus = userStore((state) => state.setLoginStatus);
    const loginStatus = userStore((state) => state.loginStatus);

    const getCurrentTime = () => new Date(Date.now() + timeOffset);

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

    useEffect(() => {
        if (schedule && schedule.EM_hora_ap && schedule.EM_hora_cierre) {
            const openingTime = convertTimeToMinutes(schedule.EM_hora_ap);
            const closingTime = convertTimeToMinutes(schedule.EM_hora_cierre);
            let breakTimeStart = null;
            let breakTimeEnd = null;
    
            if (schedule.EM_corte !== 0) {
                breakTimeStart = convertTimeToMinutes(schedule.EM_corte.slice(0, -4));
                breakTimeEnd = convertTimeToMinutes(schedule.EM_corte.slice(-4));
            }
    
            const now = getCurrentTime();
            const currentMinutes = now.getHours() * 60 + now.getMinutes();
    
            const calculateIsOpen = () => {
                if (schedule.EM_corte === 0) {
                    return currentMinutes >= openingTime && currentMinutes <= closingTime;
                } else {
                    return (
                        (currentMinutes >= openingTime && currentMinutes < breakTimeStart) ||
                        (currentMinutes >= breakTimeEnd && currentMinutes <= closingTime)
                    );
                }
            };
    
            setIsOpen(calculateIsOpen());
        }
    }, [schedule, timeOffset]);
    

    useEffect(() => {
        const fetchServerTime = async () => {
            const serverTime = await getServerTime();
            const clientTime = Date.now();
            const offset = serverTime - clientTime;
            setTimeOffset(offset);
        };

        fetchServerTime();
        const intervalId = setInterval(fetchServerTime, 3600000);

        return () => clearInterval(intervalId);
    }, []);
    // Render loading state or routes based on isLoading
    if (isLoading) {
        return(
        <div >
        <MoonLoader color="red" size={60} />
      </div>)
    }

    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Home setRazSoc={setRazSoc} razSoc={razSoc} language={language} setSchedule={setSchedule}/>} />
            <Route path="/menu" element={<Menu setCurrentOrder={setCurrentOrder} currentOrder={currentOrder} language={language} razSoc={razSoc} isOpen={isOpen} schedule={schedule}/>} />
        </Routes>
    );
}

export default App;
