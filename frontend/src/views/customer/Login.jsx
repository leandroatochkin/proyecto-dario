import React, { useState, useEffect } from 'react';
import style from './login.module.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { ES_text } from '../../utils/text_scripts';
import { handleResponse, sendVerification } from '../../utils/async_functions';
import { checkUser, getBusinessesNumber, loginUser, registerUser } from '../../utils/db_functions';
import {userStore, UIStore} from '../../utils/store';
import { MoonLoader } from 'react-spinners';
import { passwordRegex, emailRegex, phoneRegex } from '../../utils/common_functions';
import { motion } from 'framer-motion';
import {EyeOpen, EyeClosed, CircleCheck} from '../../utils/svg_icons'
import {LargeScreenNotice, ModalOneButton, CustomGoogleLoginBtn} from '../../utils/common_components'



const Login = ({language}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get('id'); // Get 'id' from query params
  const [newUser, setNewUser] = useState(null);
  const [phone, setPhone] = useState('');
  const [business, setBusiness] = useState({
                                            codRazSoc:null,
                                            businessName: null
                                          });
  const [email, setEmail] = useState('')
  const [password,  setPassword] = useState('')
  const [newAccountMode, setNewAccountMode] = useState(false)
  const [repeatPassword, setRepeatPassword] = useState('')
  const [isGoogleLogin, setIsGoogleLogin] = useState(false)
  const [continueBtn, setContinueBtn] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [invalidCredentials, setInvalidCredentials] = useState(false)
  const [userAlreadyExists, setUserAlreadyExists] = useState(false)




  // Zustand store for login status
  const setLoginStatus = userStore((state) => state.setLoginStatus);
  const setData = userStore((state)=>state.setTokenData)
  const data = userStore((state)=>state.tokenData)
  const setLoading = UIStore((state) => state.setLoading);
  const loading =  UIStore((state) => state.loading);
  const setOpenModal = UIStore((state) => state.setOpenModal);
  const openModal = UIStore((state)=>state.openModal)
  const error = UIStore((state)=>state.error)
  const setError = UIStore((state)=>state.setError)
  const openErrorModal = UIStore((state)=>state.openErrorModal)
  const setOpenErrorModal = UIStore((state)=>state.setOpenErrorModal)                                        


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



      } catch (error) {
        console.error("Error fetching business number:", error);
      } finally {
        setLoading(false); // Mark business loading as complete
      }
    } else {
      setLoading(false); // No id, still set loading to false
    }
  };

  fetchBusinessNumber();
}, [id]);


  // Handle Google login response
  const handleLogin = async () => {

    setLoading(true);

    try {
      const { exists, userId, valid, emailVerified, token } = await loginUser(email, password);

      if(!valid){
        setInvalidCredentials(true)
        return
      }

      if(exists && valid && !emailVerified){
        alert('Please verify your email address')
        return
      }
      if (exists && emailVerified && valid) {
        setNewUser(false);
        setLoginStatus(true, userId);
        if(business.codRazSoc){
          navigateToMenuIfId()
        } else {
          navigate('/home')
        }; // Navigate to the menu if there's an ID after login
      } else {
        setNewUser(true);
        setOpenModal(true);
        setData(token); // Save response for later registration
      }
    } catch (e) {
      console.error('Error checking user:', e);
      setOpenErrorModal(true)
      setError('Servidores apagados para realizar la demo.')
    } finally {

      setLoading(false);
    }
  };

 const handleRegister = async () => {
    if (password === repeatPassword && passwordRegex.test(password) && emailRegex.test(email)) {
      setLoading(true);

      const userChecked = await checkUser(email)

      setLoading(false)
      if(userChecked.exists === false){
        setOpenModal(true);
  
        if (phone !== '' && phoneRegex.test(phone)) {
          try {
            const response = await registerUser(email, password, phone, false);
  
    
            if (response.success) {
              setNewUser(false);
              setLoginStatus(true, response.userId);
              sendVerification(email, response.userId)
    
              // Navigate immediately after successful registration
              if (business.codRazSoc) {
                navigateToMenuIfId();
              } else {
                navigate('/home');
              }
            }
          } catch (e) {
            if (e.response && e.response.status === 409) {
              setOpenModal(false)
              setInvalidCredentials(true); // Set the invalid credentials state
            } else {
              console.error('Error registering user:', e);
            }
          }
        } 
      } else {
        setUserAlreadyExists(true);
      }
      }


  }; 

  const handleGoogleLoginRegister = async (email) => {
    try {
      // Check if user exists
      const userExists = await checkUser(email);

  
      if (userExists.exists) {
        setNewUser(false);
        setLoginStatus(true, userExists.userId);
  
        // Navigate based on business presence
        business.codRazSoc ? navigateToMenuIfId() : navigate('/home');
      } else {
        setPhone('')
        // User does not exist, proceed with registration
        setOpenModal(true);
        setEmail(email)
      }
    } catch (e) {
      console.error('Error checking user:', e);
    }
  };

  const handleContinue = async () => {
    try {
      const response = await registerUser(email, null, phone, true);


      if (response.success) {
        setNewUser(false);
        setLoginStatus(true, response.userId);

        // Navigate based on business presence
        business.codRazSoc ? navigateToMenuIfId() : navigate('/home');
      } else {
        console.error('Registration failed:', response);
      }
    } catch (e) {
      console.error('Error registering user:', e);
    }
  }

  
  //Navigate to /menu only if there's a valid id and business number
  const navigateToMenuIfId = () => {
    if (id && business) {
      navigate('/menu', { state: { razSoc: business.codRazSoc, businessNameFromLogIn: business.businessName} });
    }
  };


  // Check if a user has been created and navigate to menu
  useEffect(() => {
    if (newUser === false && business) {
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

  useEffect(() => {
    const timer = setTimeout(() => {
      
      invalidCredentials ? setInvalidCredentials(false) :  null;

    }, 3000);
    return () => clearTimeout(timer);
  }, [invalidCredentials]);

  useEffect(() => {
    const timer = setTimeout(() => {
      
      userAlreadyExists ? setUserAlreadyExists(false) :  null;

    }, 3000);
    return () => clearTimeout(timer);
  }, [userAlreadyExists]);

  if (loading) {
    return (
      <div className={style.container}>
        <MoonLoader color="red" size={50} aria-label="Loading spinner" />
      </div>
    );
  }

  return (
    <div className={style.container} aria-label="Login container">
      <LargeScreenNotice />
      {
        openErrorModal && (
          <ModalOneButton 
          message={error}
          setFunction={setOpenErrorModal}
          buttonText={'ok'}
          />
        )
      }
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
          <img src={'/images/malbec_logo_transparente.PNG'} className={style.logo} alt="Malbec Logo" />
        </div>

        {/* Show loader while the login process is happening */}
        
          <div className={style.formContainer} aria-label="Google login button container">
            
            {/*-----------------------inputs container---------------------------*/}
            <h4 className={style.legend} aria-label="Login form legend">login</h4>
              <div  className={style.inputContainer}>
                {/*-----------------------email input---------------------------*/}
                <input type='text' name='email' placeholder='email' onChange={(e)=>setEmail(e.target.value)} className={style.input}/>


                <div className={style.inputLine}>
                    <input type={showPassword ? 'text' : 'password'} name='password'  placeholder='password'onChange={(e)=>setPassword(e.target.value)} className={style.inputPass}/>
                    <button className={style.eyeButton} onClick={()=>setShowPassword(!showPassword)}><span id="togglePassword" className={style.eye}>{showPassword ? <EyeClosed />  : <EyeOpen />}</span></button>
                </div>
                <p className={invalidCredentials ? style.invalidCredentials : style.hidden}>{language.invalid_credentials}</p>
                <div className={newAccountMode ? style.inputLine : style.hidden}>
                    <input type={showPassword ? 'text' : 'password'} name='password'  placeholder='repetir password'onChange={(e)=>setRepeatPassword(e.target.value)} className={newAccountMode ? style.inputPass : style.inputHidden}/>
                    <button className={style.eyeButton} onClick={()=>setShowPassword(!showPassword)}><span id="togglePassword" className={style.eye}>{showPassword ? <EyeClosed />  : <EyeOpen />}</span></button>
                </div>
                <p className={userAlreadyExists ? style.invalidCredentials : style.hidden}>{language.user_already_exists}</p>
              </div>
              <div className={style.loginBtnContainer}>
{/*-----------------------login button---------------------------*/}

                    <button onClick={!newAccountMode ? handleLogin : handleRegister} className={style.button}>{!newAccountMode ? 'login' : (!phone ? language.create_account_button : 'siguiente')}</button>
             
{/*-----------------------login button---------------------------*/}
              </div>



              <div className={(!isGoogleLogin) ? style.hidden : style.verificationMsg}>{language.verification_message}</div>
            

            <p className={!newAccountMode ? style.createAccP : style.hidden}>{language.create_account_preface}<span onClick={()=>setNewAccountMode(!newAccountMode)}  className={style.createAccSpan}>{language.create_account_button}</span></p>
            <span onClick={()=>setNewAccountMode(!newAccountMode)} style={{color: '#212427', fontWeight: 'bolder'}} className={newAccountMode ? '' : style.hidden}>{language.cancel}</span>
          {/*-----------------------inputs container---------------------------*/}
            <div className={style.loginBtnContainer}>
            <p className={style.createAccP}>{language.or_else}</p>
            {!continueBtn ?
             <CustomGoogleLoginBtn 
             handleGoogleLoginRegister={handleGoogleLoginRegister} 
             setIsGoogleLogin={setIsGoogleLogin} 
             setContinueBtn={setContinueBtn}/> 
             : 
             <motion.button 
             initial={{ scale: '1' }}
             whileTap={{ scale: '0.95' }}
             className={style.continueBtn}
             onClick={handleContinue}>
              {language.continue}
              <CircleCheck className={style.check}/>
              </motion.button>}
            </div>
          </div>
        
      </div>

      {/* <footer className={style.footer}>
        <p><a href='/documentation/attributions.html' target='_blank' rel="noopener noreferrer">about||</a></p>
        <p>code by <a href='https://github.com/leandroatochkin'>lna||</a></p>
        <p>logos by <a href='https://www.instagram.com/andres_actis?igsh=dDA5ejYxbmVtOW51'>blick</a></p>
      </footer> */}
    </div>
  );
};

export default Login;
