import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import style from './Home.module.css';
import { getBusinessesByCity, getSchedule } from '../../utils/db_functions';
import {userStore, UIStore} from '../../utils/store';
import { MoonLoader } from 'react-spinners';
import { motion } from 'framer-motion';
import {ModalOneButton, LargeScreenNotice, CitySelector} from '../../utils/common_components';
import {MapLocation} from '../../utils/svg_icons'


const Home = ({ setCodRazSoc, setSchedule, setBusinessName }) => {
    const [businesses, setBusinesses] = useState({});
    const [loading, setLoading] = useState(true);
    const [openErrorModal, setOpenErrorModal] = useState(false);
    const [openCityModal, setOpenCityModal] = useState(false)


    const navigate = useNavigate();

    const language = UIStore((state)=>state.language)

    const loginStatus = userStore((state) => state.loggedIn); // Get login status

    const city = userStore((state) => state.city); // Get city from user store

    
    const error = userStore((state) => state.error); // Get error from user store

    const setError = userStore((state) => state.setError); // Set error in user store


    const filterUniqueBusinesses = (businessesArray) => {
        const uniqueBusinesses = [];
        const seenNames = new Set();

        businessesArray.forEach((business) => {
            if (!seenNames.has(business.EM_nom_fant)) {
                seenNames.add(business.EM_nom_fant);
                uniqueBusinesses.push(business);
            }
        });

        return uniqueBusinesses;
    };

    const groupBusinessesByLetter = (businessesArray) => {
        // Sort the businesses alphabetically by EM_nom_fant
        const sortedBusinesses = businessesArray.sort((a, b) => {
            const nameA = a.EM_nom_fant.toUpperCase();
            const nameB = b.EM_nom_fant.toUpperCase();
            if (nameA < nameB) return -1;
            if (nameA > nameB) return 1;
            return 0;
        });

        const groupedBusinesses = {};
        sortedBusinesses.forEach((business) => {
            const firstLetter = business.EM_nom_fant[0].toUpperCase();
            if (!groupedBusinesses[firstLetter]) {
                groupedBusinesses[firstLetter] = [];
            }
            groupedBusinesses[firstLetter].push(business);
        });

        return groupedBusinesses;
    };

    const handleClick = async (business) => {
        const db_schedule = await getSchedule(business.EM_ID_suc) || []
        setSchedule(...db_schedule);
        setCodRazSoc(business.EM_cod_raz_soc);
        setBusinessName(business.EM_nom_fant)
        navigate('/menu');
    };

    useEffect(()=>{
        city === '' ? setOpenCityModal(true) : null
    },[])

    useEffect(() => {
        const db_businesses = async () => {
            setLoading(true)
            try {
                if (city !== '') {
                    const retrievedBusinesses = await getBusinessesByCity(city.trim());
                    if(retrievedBusinesses.length > 0){
                        const uniqueBusinesses = filterUniqueBusinesses(retrievedBusinesses);
                        const groupedBusinesses = groupBusinessesByLetter(uniqueBusinesses);
                        setBusinesses(groupedBusinesses);
                    } else {
                        setBusinesses([])
                    }

                } else {
                    setOpenCityModal(true); // Show the modal for empty city
                    return; // Exit early as there's no city to fetch
                }
            } catch (e) {
                console.log(e);
                setError('404');
            } finally {
                setLoading(false);
            }
        };
    
        db_businesses();
    }, [city]); // Add `city` as a dependency
    

    const handleLocationClick = () => {
        setOpenCityModal(true);
    }

    if (loading) {
        return (
            <div className={style.containerLoader} aria-live="polite" aria-busy="true">
                <MoonLoader color="red" size={50} />
            </div>
        );
    }


    return (
        <div className={style.container} role="main" aria-labelledby="business-list-heading">
            <LargeScreenNotice />
            {openErrorModal && (
                <ModalOneButton
                    message={language.error_messages.error_try_again_later}
                    setFunction={setOpenErrorModal}
                    buttonText={'ok'}

                />
            )}
            {openCityModal && (
                <CitySelector stateSetter={setOpenCityModal}/>
            )}
            <div className={style.logoContainer}>
                <img
                    src={'/images/malbec_logo_transparente(s_reflejo).PNG'}
                    className={style.logo}
                    alt="Malbec logo"
                />
            </div>
            <div className={style.indexContainer}>
    <div className={style.indexTitle}>
    <h2>{`Negocios en ${city}`}</h2><span onClick={handleLocationClick}><MapLocation  /></span>
    </div>
    {businesses && Object.keys(businesses).length > 0 ? (
        Object.keys(businesses).map((letter, index) => (
            <div key={index}>
                <h2 className={style.h2} id={`letter-${letter}`}>{'•' + letter}</h2>
                {Array.isArray(businesses[letter]) ? (
                    businesses[letter].map((business, idx) => (
                        <motion.div
                            key={idx}
                            className={style.businessName}
                            onClick={() => handleClick(business)}
                            initial={{ scale: '1' }}
                            whileTap={{ scale: '0.95' }}
                            role="button"
                            tabIndex="0"
                            aria-label={`Select ${business.EM_nom_fant}`}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    handleClick(business);
                                }
                            }}
                        >
                            <span>{business.EM_nom_fant}</span>
                            <span>{'>'}</span>
                        </motion.div>
                    ))
                ) : (
                    <p>{language.error_messages.expected_array}</p>
                )}
            </div>
        ))
    ) : (
        <div className={style.noResults}>
        <img src='/images/no_locations.png' className={style.noResultsImage}/>
        <p>{language.info_messages.no_bussinesses_in_this_location_yet}</p>
        </div>
    )}
</div>

        </div>
    );
};

export default Home;
