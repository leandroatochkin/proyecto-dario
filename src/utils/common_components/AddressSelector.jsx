import React, { useEffect, useState } from 'react';
import userStore from '../store';
import { getAddress, addAddress } from '../db_functions';
import style from './AddressSelector.module.css'
import { ES_text } from '../text_scripts';

const AddressSelector = ({ buttonText1, language, setSelectedAddress, selectedAddress }) => {
  const [addresses, setAddresses] = useState([{ address: '', type: '1' }]);
  const [openAddAddress, setOpenAddAddress] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [addressesToMap, setAddressesToMap] = useState([]); // Ensure this is an array
  const [inactive, setInactive] = useState(false)


  const loggedIn = userStore((state) => state.loggedIn);
  const userId = userStore((state) => state.userId);

  const handleAddressChange = (index, field, value) => {
    const newAddresses = [...addresses];
    newAddresses[index][field] = value;
    setAddresses(newAddresses);
  };

  const addNewAddress = () => {
    const lastAddress = addresses[addresses.length - 1];
    if (lastAddress.address !== '' && lastAddress.type !== '') {
      setAddresses([...addresses, { address: '', type: '' }]);
    }
  };

  const handleSendAddresses = async () => {
    try {
      const response = await addAddress(userId, addresses);
      console.log(response);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    console.log('Current Addresses:', addresses);
  }, [addresses]);

  const retrieveAddress = async (userId) => {
    try {
      const result = await getAddress(userId);
      console.log('Retrieved Addresses:', result); // Log the full result

      // Access the addresses from the result object
      const retrievedAddresses = result.addresses; // This accesses the addresses array

      // Ensure retrievedAddresses is an array
      if (Array.isArray(retrievedAddresses) && retrievedAddresses.length > 0) {
        const formattedAddresses = retrievedAddresses.map(item => ({
          address: item.address,
          type: item.type || 'home', // Default to 'home' if type is not provided
        }));
        setAddressesToMap(formattedAddresses); // Set the formatted addresses
        console.log('Formatted Addresses to Map:', formattedAddresses); // Log formatted addresses
      } else {
        setOpenAddAddress(true);
      }
    } catch (error) {
      console.log('Error fetching addresses:', error);
    }
  };

  const getAddressLabel = (type) => {
    switch (type) {
      case '1':
        return language.select_home; // Spanish for 'Home'
      case '2':
        return language.select_work; // Spanish for 'Work'
      case '3':
        return language.select_other; // Spanish for 'Other'
      default:
        return 'Dirección'; // Default case if the type is unknown
    }
  };

  useEffect(() => {
    if (loggedIn && userId) {
      retrieveAddress(userId);
    }
  }, [loggedIn, userId]);


  return (
    <div className={style.container}>
      {addressesToMap.length > 0 && addressesToMap.map((address, index) => (
        <div key={index} 
        className={style.addressLine} 
        onClick={()=>setSelectedAddress(address)}>
        {address.address}
        <span>({getAddressLabel(address.type)})</span>
        {selectedAddress 
        && 
        selectedAddress.address === address.address && (
          <span style={{ marginLeft: '8px', color: 'green' }}>✔️</span> // Tick icon
        )}</div>

      ))}
      <button onClick={() => {
        setShowInput(!showInput)
        setInactive(!inactive)
        }}
        disabled={inactive === false ?  false : true}
        className={style.addAddressBtn}

        >{buttonText1}</button>

      {showInput &&
        addresses.map((item, index) => (
          <div key={index} className={style.addressInput}>
            <input
              type='text'
              name='address'
              value={item.address}
              onChange={(e) => handleAddressChange(index, 'address', e.target.value)}
              placeholder={ES_text.add_address}
              className={style.input}
              maxLength={'50'}
            />
            <select
              name='type'
              value={item.type}
              onChange={(e) => handleAddressChange(index, 'type', e.target.value)}
              className={style.select}
            >
              <option value='1'>{language.select_home}</option>
              <option value='2'>{language.select_work}</option>
              <option value='3'>{language.select_other}</option>
            </select>
          </div>
        ))}
      <div className={style.btnContainer}>
      <button 
      onClick={addNewAddress}
      style={!inactive ? {display: 'none'} : {display: 'flex'}}
      >+</button> {/* Add new address */}
      <button onClick={handleSendAddresses}>{language.save}</button>
      </div>
    </div>
  );
};

export default AddressSelector;
