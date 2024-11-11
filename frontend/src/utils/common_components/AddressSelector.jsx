import React, { useEffect, useState, useRef } from 'react';
import {userStore} from '../store';
import { getAddress, addAddress, deleteAddress } from '../db_functions';
import style from './AddressSelector.module.css';
import { ES_text } from '../text_scripts';
import { motion, transform } from 'framer-motion';
import { getAddressLabel } from '../common_functions';
import { MoonLoader } from 'react-spinners';
import Trashcan from '../Icons/Trashcan';
import DoubleArrow from '../Icons/DoubleArrow';

const AddressSelector = ({ buttonText1, language, setSelectedAddress, selectedAddress }) => {
  const [addresses, setAddresses] = useState([{ address: '', type: '1' }]);
  const [openAddAddress, setOpenAddAddress] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [addressesToMap, setAddressesToMap] = useState([]); // To map addresses
  const [inactive, setInactive] = useState(false);
  const [openDeleteAddressModal, setOpenDeleteAddressModal] = useState(null); // Store index of selected row
  const [showDeleteAddressModal, setShowDeleteAddressModal] = useState(false);
  const [loading, setLoading] = useState(false)
  const [isRotated, setIsRotated] = useState(false);

  const containerRef = useRef(null);

  useEffect(()=>{console.log(isRotated)},[isRotated])

  
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


  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
        
        // If scrolled to the bottom, set `isRotated` to true, else false
        setIsRotated(scrollTop + clientHeight >= scrollHeight - 10); // Adding a small buffer (10px) to detect scroll at the bottom
      }
    };
  
    const container = containerRef.current;
    container.addEventListener('scroll', handleScroll);
    
    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  
  
  


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

  const handleDeleteAddress = async (userId, addressId) => {
    setLoading(true)
    try {

      // Await the delete operation
      await deleteAddress(userId, addressId);
  
      // Update the state to filter out the deleted address
      setAddressesToMap(
        addressesToMap.filter((address) => address.addressId !== addressId)
      );
  
      // Close the delete modal
      setOpenDeleteAddressModal(null);
      setShowDeleteAddressModal(false);
    } catch (e) {
      console.log(e);
    }
    setTimeout(()=>{
      setLoading(false)
    },1500)
  };
  


  useEffect(() => {
    if (loggedIn && userId) {
      retrieveAddress(userId);
    }
  }, [loggedIn, userId]);

  if (loading) {
    return (
      <div style={{display: 'flex'  ,justifyContent: 'center', alignItems: 'center', width: '100%', padding: '2%'}}>
        <MoonLoader color="red" size={20} aria-label="Loading spinner" />
      </div>
    );
  }


  return (
    <div className={style.container}>
      <p className={style.topP}>{language.please_select_address_b}{`(✔️) `}{language.or_add_a_new_address}</p>
      <div className={style.addressesContainer} ref={containerRef}>
      {addressesToMap.length > 0 && addressesToMap.map((address, index) => (
        <div 
          key={index} 
          className={style.addressLine} 
          onClick={() => setSelectedAddress(address)}
          aria-label={`Address ${address.address}, type: ${getAddressLabel(address.type)}`}
        >
          <div className={style.addressData}>
          {address.address}
          <span>({getAddressLabel(language, address.type)})</span>
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
<Trashcan />
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
      </div>
      <motion.div 
      className={style.arrowContainer}
      animate={{ rotate: isRotated ? 180 : 0 }}
      transition={{ duration: 0.3 }}
      >
        {addressesToMap.length > 4 ? <DoubleArrow width={'30'} height={'30'} className={style.arrow}/> : ''}
        </motion.div>
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
