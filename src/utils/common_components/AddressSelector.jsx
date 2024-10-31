import React, { useEffect, useState } from 'react';
import userStore from '../store';
import { getAddress, addAddress } from '../db_functions';
import style from './AddressSelector.module.css';
import { ES_text } from '../text_scripts';
import { motion } from 'framer-motion';

const AddressSelector = ({ buttonText1, language, setSelectedAddress, selectedAddress }) => {
  const [addresses, setAddresses] = useState([{ address: '', type: '1' }]);
  const [openAddAddress, setOpenAddAddress] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [addressesToMap, setAddressesToMap] = useState([]); // To map addresses
  const [inactive, setInactive] = useState(false);

  const loggedIn = userStore((state) => state.loggedIn);
  const userId = userStore((state) => state.userId);

  const isValidAddress = (address) => /^[a-zA-Z0-9\s.,#\-\/]+$/.test(address);

  const handleAddressChange = (index, field, value) => {
    if (field === 'address' && !isValidAddress(value)) return; // Ignore invalid characters

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
    // Filter out invalid addresses before sending
    const validAddresses = addresses.filter((address) => isValidAddress(address.address) && address.address !== '');
    
    if (validAddresses.length === 0) {
      console.log("No valid addresses to send.");
      return;
    }

    try {
      const response = await addAddress(userId, validAddresses);

      // Update addressesToMap to reflect the new ones
      setAddressesToMap((prevAddresses) => [
        ...prevAddresses,
        ...validAddresses
      ]);

      // Reset input fields and hide the input area
      setAddresses([{ address: '', type: '1' }]);
      setShowInput(false);
      setInactive(false);

    } catch (e) {
      console.log(e);
    }
  };

  const retrieveAddress = async (userId) => {
    try {
      const result = await getAddress(userId);

      const retrievedAddresses = result.addresses; 

      if (Array.isArray(retrievedAddresses) && retrievedAddresses.length > 0) {
        const formattedAddresses = retrievedAddresses.map(item => ({
          address: item.address,
          type: item.type || 'home', 
        }));
        setAddressesToMap(formattedAddresses); 
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
        return language.select_home;
      case '2':
        return language.select_work;
      case '3':
        return language.select_other;
      default:
        return 'Dirección';
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
          onClick={() => setSelectedAddress(address)}
        >
          {address.address}
          <span>({getAddressLabel(address.type)})</span>
          {selectedAddress && selectedAddress.address === address.address && (
            <span style={{ marginLeft: '8px', color: 'green' }}>✔️</span> 
          )}
        </div>
      ))}

      <motion.button 
        onClick={() => {
          setShowInput(!showInput);
          setInactive(!inactive);
        }}
        disabled={inactive === false ? false : true}
        className={style.addAddressBtn}
        style={{ transform: "scale(1)" }}
        whileTap={{ scale: '0.95' }}
      >
        {buttonText1}
      </motion.button>

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
        <motion.button 
          onClick={addNewAddress}
          style={!inactive ? { display: 'none' } : { display: 'flex', transform: "scale(1)" }}
          whileTap={{ scale: '0.95' }}
        >
          +
        </motion.button>
        
        <motion.button 
          onClick={handleSendAddresses} 
          style={!showInput ? {display: 'none'} : {display: 'block', transform: "scale(1)"}}
          whileTap={{ scale: '0.95' }}
        >{language.save}
        </motion.button>
      </div>
    </div>
  );
};

export default AddressSelector;
