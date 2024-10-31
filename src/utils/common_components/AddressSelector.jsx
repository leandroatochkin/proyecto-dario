import React, { useEffect, useState } from 'react';
import userStore from '../store';
import { getAddress, addAddress, deleteAddress } from '../db_functions';
import style from './AddressSelector.module.css';
import { ES_text } from '../text_scripts';
import { motion } from 'framer-motion';

const AddressSelector = ({ buttonText1, language, setSelectedAddress, selectedAddress }) => {
  const [addresses, setAddresses] = useState([{ address: '', type: '1' }]);
  const [openAddAddress, setOpenAddAddress] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [addressesToMap, setAddressesToMap] = useState([]); // To map addresses
  const [inactive, setInactive] = useState(false);
  const [openDeleteAddressModal, setOpenDeleteAddressModal] = useState(null); // Store index of selected row
  const [showDeleteAddressModal, setShowDeleteAddressModal] = useState(false);


  
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
    const validAddresses = addresses.filter((address) => isValidAddress(address.address) && address.address !== '');
    
    if (validAddresses.length === 0) {
      console.log("No valid addresses to send.");
      return;
    }

    try {
      const response = await addAddress(userId, validAddresses);

      setAddressesToMap((prevAddresses) => [
        ...prevAddresses,
        ...validAddresses
      ]);

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
          addressId: item.id,
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

  const handleDeleteAddress  = async (userId, addressId) => {

    try{
      const response = await deleteAddress(userId, addressId);
      setShowDeleteAddressModal(!showDeleteAddressModal)
      return

    }
    catch(e){
      console.log(e)
    }
  }

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
        <div 
          key={index} 
          className={style.addressLine} 
          onClick={() => setSelectedAddress(address)}
          aria-label={`Address ${address.address}, type: ${getAddressLabel(address.type)}`}
        >
          <div className={style.addressData}>
          {address.address}
          <span>({getAddressLabel(address.type)})</span>
          </div>
          
          {selectedAddress && selectedAddress.address === address.address && (
            <div className={style.selectedAddressRow}> 
              <span style={{ marginLeft: '8px', color: 'green' }}>✔️</span> 
              <span 
                aria-label="Delete this address"
                style={openDeleteAddressModal === index ? {marginRight: '1%', color: 'green'} : {}}
                onClick={(e) => {
                  e.stopPropagation(); // Prevents triggering row selection
                  setOpenDeleteAddressModal(index); // Set to the selected row's index
                  setShowDeleteAddressModal(!showDeleteAddressModal)
                }}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="lucide lucide-trash-2"
                  aria-hidden="true"
                >
                  <path d="M3 6h18" />
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                  <line x1="10" y1="11" x2="10" y2="17" />
                  <line x1="14" y1="11" x2="14" y2="17" />
                </svg>
              </span>
            </div>
          )}
          
          {/* Only display delete confirmation for the selected row */}
          {openDeleteAddressModal === index && (
            <div
             aria-label="Delete confirmation"
             onClick={()=>{
              
              handleDeleteAddress(userId, selectedAddress.addressId)
             }}
             style={showDeleteAddressModal ? {display: 'flex', fontWeight: 'bolder'} : {display: 'none'}}
             >
              {'¿' + language.delete + '?'}
            </div>
          )}
        </div>
      ))}

      <motion.button 
        onClick={() => {
          setShowInput(!showInput);
          setInactive(inactive);
        }}
        disabled={inactive}
        className={style.addAddressBtn}
        aria-label="Add a new address"
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
              aria-label="Enter new address"
            />
            <select
              name='type'
              value={item.type}
              onChange={(e) => handleAddressChange(index, 'type', e.target.value)}
              className={style.select}
              aria-label="Select address type"
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
          aria-label="Add another address field"
          whileTap={{ scale: '0.95' }}
        >
          +
        </motion.button>
        
        <motion.button 
          onClick={handleSendAddresses} 
          style={!showInput ? { display: 'none' } : { display: 'block', transform: "scale(1)" }}
          aria-label="Save addresses"
          whileTap={{ scale: '0.95' }}
        >
          {language.save}
        </motion.button>
      </div>
    </div>
  );
};

export default AddressSelector;
