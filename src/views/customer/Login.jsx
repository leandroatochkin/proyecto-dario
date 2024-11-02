import React, { useState, useEffect } from 'react';
import style from './login.module.css';
import ModalOneButton from '../../utils/common_components/ModalOneButton';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate, useLocation } from 'react-router-dom';
import { ES_text } from '../../utils/text_scripts';
import { handleResponse } from '../../utils/async_functions';
import { checkUser, getBusinessesNumber } from '../../utils/db_functions';
import { jwtDecode } from 'jwt-decode';
import userStore from '../../utils/store';
import { MoonLoader } from 'react-spinners';
import LargeScreenNotice from '../../utils/common_components/LargeScreenNotice';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get('id'); // Get 'id' from query params
  const [openModal, setOpenModal] = useState(false);
  const [newUser, setNewUser] = useState(null);
  const [phone, setPhone] = useState('');
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);
  const [business, setBusiness] = useState({
                                            codRazSoc:null,
                                            businessName: null
                                          });
  const [businessLoading, setBusinessLoading] = useState(true);



  // Zustand store for login status
  const setLoginStatus = userStore((state) => state.setLoginStatus);

  // Fetch business number based on id
  useEffect(() => {
  const fetchBusinessNumber = async () => {
    if (id) {
      try {
        const result = await getBusinessesNumber(id);
        
        setBusiness(prevState => ({
          ...prevState,
          codRazSoc: result[0].EM_cod_raz_soc,
          businessName: result[0].EM_nom_fant
        }));


        console.log(result)
      } catch (error) {
        console.error("Error fetching business number:", error);
      } finally {
        setBusinessLoading(false); // Mark business loading as complete
      }
    } else {
      setBusinessLoading(false); // No id, still set loading to false
    }
  };

  fetchBusinessNumber();
}, [id]);


  // Handle Google login response
  const decodeResponse = async (response) => {
    setLoginLoading(true);
    const decodedToken = jwtDecode(response.credential);
    const email = decodedToken.email;

    try {
      const { exists, userId } = await checkUser(email);
      if (exists) {
        setNewUser(false);
        setLoginStatus(true, userId);
        if(business.codRazSoc){
          navigateToMenuIfId()
        } else {
          navigate('/')
        }; // Navigate to the menu if there's an ID after login
      } else {
        setNewUser(true);
        setOpenModal(true);
        setData(response); // Save response for later registration
      }
    } catch (e) {
      console.error('Error checking user:', e);
    } finally {
      setLoginLoading(false);
    }
  };

  //Navigate to /menu only if there's a valid id and business number
  const navigateToMenuIfId = () => {
    if (id && business) {
      navigate('/menu', { state: { razSoc: business.codRazSoc, businessNameFromLogIn: business.businessName} });
    }
  };

  // Handle new user registration
  useEffect(() => {
    if (newUser && data.credential && phone) {
      handleResponse(data.credential, phone, setNewUser, setLoginStatus, setLoading, navigate, setBusinessNum, id, navigateToMenuIfId);
    }
  }, [data, newUser, phone]);

  // Check if a user has been created and navigate to menu
  useEffect(() => {
    if (newUser === false && businessNum) {
      navigateToMenuIfId(); // Navigate to menu if the user is no longer new and there's a business number
    }
  }, [newUser, business]);

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className={style.loaderContainer}>
        <MoonLoader color="#4A90E2" size={50} aria-label="Loading spinner" />
      </div>
    );
  }

  return (
    <div className={style.container} aria-label="Login container">
      <LargeScreenNotice />
      {openModal && (
        <ModalOneButton
          message={ES_text.phone_modal}
          setFunction={setOpenModal}
          buttonText={ES_text.button_enter}
          stateSetter={setPhone}  // Set the phone number
        />
      )}

      <div className={style.login} aria-label="Login form">
        <div className={style.title} aria-label="Welcome Back!">
          <img src={'/public/images/malbec_logo_transparente.PNG'} className={style.logo} alt="Malbec Logo" />
        </div>

        {/* Show loader while the login process is happening */}
        {loginLoading ? (
          <div className={style.loaderContainer}>
            <MoonLoader color="red" size={60} aria-label="Loading spinner" />
          </div>
        ) : (
          <div className={style.loginBtnContainer} aria-label="Google login button container">
            <GoogleLogin
              onSuccess={decodeResponse}
              onError={() => console.log('Login error')}
              scope="https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email"
              aria-label="Google login button"
            />
          </div>
        )}
      </div>

      <footer className={style.footer}>
        <p>code by <a href='https://github.com/leandroatochkin'>leandroatochkin</a></p>
        <p>logos by <a href='https://www.instagram.com/andres_actis?igsh=dDA5ejYxbmVtOW51'>Blick Media Lab</a></p>
      </footer>
    </div>
  );
};

export default Login;
