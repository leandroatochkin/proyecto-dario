import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import style from './Home.module.css';
import { getBusinesses } from '../../utils/db_functions';
import userStore from '../../utils/store';
import { MoonLoader } from 'react-spinners';

const Home = ({ setRazSoc, razSoc }) => {

    const [businesses, setBusinesses] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();


    
    const loginStatus = userStore((state) => state.loggedIn); // Get login status
    console.log('Login status in Home:', loginStatus); //



    const filterUniqueBusinesses = (businessesArray) => {
        const uniqueBusinesses = [];
        const seenNames = new Set();

        businessesArray.forEach(business => {
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
        sortedBusinesses.forEach(business => {
            const firstLetter = business.EM_nom_fant[0].toUpperCase();
            if (!groupedBusinesses[firstLetter]) {
                groupedBusinesses[firstLetter] = [];
            }
            groupedBusinesses[firstLetter].push(business);
        });
    
        return groupedBusinesses;
    };
    

    const handleClick = (raz_soc) => {
        setRazSoc(raz_soc);
        console.log('Redirecting to menu with raz_soc:', raz_soc);
        navigate('/menu');
    };

    useEffect(() => {
        const db_businesses = async () => {
            try {
                const retrievedBusinesses = await getBusinesses();
                const uniqueBusinesses = filterUniqueBusinesses(retrievedBusinesses);
                const groupedBusinesses = groupBusinessesByLetter(uniqueBusinesses);
                setBusinesses(groupedBusinesses);
            } catch (e) {
                console.log(e);
            } finally {
                setLoading(false);
            }
        };

        db_businesses();
    }, []);

    useEffect(() => {
        console.log('Businesses:', businesses);
    }, [businesses]);

    if (loading) {
        return <div className={style.container}>
            <MoonLoader />
        </div>;
    }

    return (
        <div className={style.container}>
            <div className={style.logoContainer}><img src={'/public/images/malbec_logo_transparente(s_reflejo).PNG'} className={style.logo}/></div>
            <div className={style.indexContainer}>
                {businesses && Object.keys(businesses).map((letter, index) => (
                    <div key={index}>
                        <h2 className={style.h2}>{letter}</h2>
                        {Array.isArray(businesses[letter]) ? (
                            businesses[letter].map((business, idx) => (
                                <div
                                    key={idx}
                                    className={style.businessName}
                                    onClick={() => handleClick(business.EM_cod_raz_soc)}
                                >
                                    <span>{business.EM_nom_fant}</span><span>{'>'}</span>
                                </div>
                            ))
                        ) : (
                            <p>Error: Expected array but got something else</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;
