import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {Login, Menu, Home, VerifiedEmail} from './views/customer';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import {userStore} from './utils/store';
import { convertTimeToMinutes } from './utils/common_functions';
import { getServerTime } from './utils/async_functions';
import { getUserCity } from './utils/db_functions';

function App() {
    const [currentOrder, setCurrentOrder] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [razSoc, setRazSoc] = useState('');
    const [codRazSoc, setCodRazSoc] = useState('');
    const [businessName, setBusinessName] = useState('');
    const [schedule, setSchedule] = useState([]);
    const [isOpen, setIsOpen] = useState(true);
    const [timeOffset, setTimeOffset] = useState(0);


    const setCity = userStore((state)=>state.setCity)

    useEffect(() => {
        const fetchLocation = async () => {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              async (position) => {
                const { latitude, longitude } = position.coords;

    
                const city = await getUserCity(latitude, longitude);
                setCity(city);

              },
              (error) => {
                console.error('Error fetching location:', error);
              }
            );
          } else {
            console.error('Geolocation is not supported by this browser.');
          }
        };
    
        fetchLocation();
      }, []);



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
            <Route path="/" element={<Login  />} />
            <Route path="/login" element={<Login  />} />
            <Route path="/home" element={<Home setCodRazSoc={setCodRazSoc} setRazSoc={setRazSoc} razSoc={razSoc}  setSchedule={setSchedule} setBusinessName={setBusinessName}/>} />
            <Route path="/menu" element={<Menu setCurrentOrder={setCurrentOrder} currentOrder={currentOrder}  codRazSoc={codRazSoc} razSoc={razSoc} isOpen={isOpen} schedule={schedule} businessName={businessName}/>} />
            <Route path="/verification" element={<VerifiedEmail />}/>                                                                                                                        
        </Routes>
    );
}

export default App;
