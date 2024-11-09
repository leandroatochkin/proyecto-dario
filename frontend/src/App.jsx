import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Login from './views/customer/Login';
import Menu from './views/customer/Menu';
import Home from './views/customer/Home';
import VerifiedEmail from './views/customer/VerifiedEmail';
import './App.css';
import { ES_text } from './utils/text_scripts';
import { Route, Routes } from 'react-router-dom';
import {userStore} from './utils/store';
import { convertTimeToMinutes } from './utils/common_functions';
import { getServerTime } from './utils/async_functions';
import { consoleMsg } from './utils/text_scripts';
import { MoonLoader } from 'react-spinners';
import { UIStore } from '../src/utils/store'
function App() {
    const [currentOrder, setCurrentOrder] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [razSoc, setRazSoc] = useState('');
    const [codRazSoc, setCodRazSoc] = useState('');
    const [businessName, setBusinessName] = useState('');
    const [schedule, setSchedule] = useState([]);
    const [language, setLanguage] = useState(ES_text);
    const [isOpen, setIsOpen] = useState(true);
    const [timeOffset, setTimeOffset] = useState(0);

    useEffect(() => console.log(consoleMsg), []);


    const navigate = useNavigate();
    const setLoginStatus = userStore((state) => state.setLoginStatus);
    const loginStatus = userStore((state) => state.loginStatus);

    const getCurrentTime = () => new Date(Date.now() + timeOffset);

    // This effect fetches server time and updates the time offset.
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

    useEffect(() => {
        if (schedule && schedule.EM_hora_ap && schedule.EM_hora_cierre) {
            const openingTime = convertTimeToMinutes(schedule.EM_hora_ap);
            const closingTime = convertTimeToMinutes(schedule.EM_hora_cierre);

            let breakTimeStart = null;
            let breakTimeEnd = null;

            // Set break times only if EM_corte is not 0
            if (schedule.EM_corte !== 0) {
                breakTimeStart = convertTimeToMinutes(schedule.EM_corte.slice(0, 4));
                breakTimeEnd = convertTimeToMinutes(schedule.EM_corte.slice(4));
            }

            const now = getCurrentTime();
            const currentMinutes = now.getHours() * 60 + now.getMinutes();

            const calculateIsOpen = () => {
                
                if (schedule.EM_corte === '0') {
                    const isWithinOpenHours = currentMinutes >= openingTime && currentMinutes <= closingTime;
                    return isWithinOpenHours;
                } else {
                    const isBeforeBreak = currentMinutes >= openingTime && currentMinutes < breakTimeStart;
                    const isAfterBreak = currentMinutes >= breakTimeEnd && currentMinutes <= closingTime;
                    return isBeforeBreak || isAfterBreak;
                }
            };

            const openStatus = calculateIsOpen();
            setIsOpen(openStatus); // Update the state with the calculated value
        }
    }, [schedule, timeOffset]);

    return (
        <Routes>
            <Route path="/" element={<Login language={ES_text} />} />
            <Route path="/login" element={<Login language={ES_text} />} />
            <Route path="/home" element={<Home setCodRazSoc={setCodRazSoc} setRazSoc={setRazSoc} razSoc={razSoc} language={language} setSchedule={setSchedule} setBusinessName={setBusinessName}/>} />
            <Route path="/menu" element={<Menu setCurrentOrder={setCurrentOrder} currentOrder={currentOrder} language={language} codRazSoc={codRazSoc} razSoc={razSoc} isOpen={isOpen} schedule={schedule} businessName={businessName}/>} />
            <Route path="/verification" element={<VerifiedEmail language={language}/>}/>                                                                                                                        
        </Routes>
    );
}

export default App;
