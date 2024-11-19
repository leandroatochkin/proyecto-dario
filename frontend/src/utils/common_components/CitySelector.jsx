import React, { useEffect, useState } from 'react'
import Backdrop from './Backdrop'

import { argentinaMap } from '../cities';
import style from './CitySelector.module.css'
import { UIStore, userStore } from '../store';



const CitySelector = ({stateSetter}) => {
const [searchValue, setSearchValue] = useState('')
const [filteredResults, setFilteredResults] = useState([]);


const language = UIStore((state)=>state.language)
const setCity = userStore((state)=>state.setCity)

const city = userStore((state)=>state.city)



const handleSearch = (e) => {
  const query = e.target.value.toLowerCase();
  setSearchValue  (query);

  if (query === '') {
    setFilteredResults([]);
    return;
  }

  // Filter the data
  const results = argentinaMap.flatMap((region) =>
    region.ciudades.filter((ciudad) =>
      ciudad.nombre.toLowerCase().includes(query)
    )
  );

  setFilteredResults(results);
};

const handleClick = (city) => {
  setCity(city.toLowerCase())
  stateSetter(false)
}


  return (
    <Backdrop>
      <div className={style.messageContainer}>
        <h1 className={style.message}>{language.info_messages.select_city}</h1>
        {stateSetter && 
        <div className={style.inputContainer}>
          
          <input
            type="text"
            onChange={handleSearch}
            placeholder="Area Code"
            className={style.inputCorrect}
            name='area'
          />
          <ul style={{ listStyle: 'none', padding: 0, marginTop: '10px' }} className={style.resultContainer}>
        {filteredResults.map((city) => (
          <li key={city.id} style={{ padding: '5px', textAlign: 'left' }} className={style.resultLine} onClick={()=>{handleClick(city.nombre)}}>
            {city.nombre}
          </li>
        ))}
        {filteredResults.length === 0 && searchValue !== '' && (
          <li style={{ padding: '5px', color: 'gray' }}>No results found</li>
        )}
      </ul>
        </div>
        }
      </div>
    </Backdrop>
  );
}

export default CitySelector