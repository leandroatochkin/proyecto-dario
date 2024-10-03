import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Backdrop from './Backdrop';
import userStore from '../store';
import { getAddress, addAddress } from '../db_functions';
import { ES_text } from '../text_scripts';

const AddressSelector = ({buttonText1}) => {
  const [addresses, setAddresses] = useState([{ address: '', type: 'home' }]); // Initialize with one address field
  const [addAddress, setAddAddress] = useState(false)
  const [showInput, setShowInput] = useState(false)
  

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

  const handleSendAddresses =  async () => {
    try {
      const response = await addAddress(userId, addresses);
      console.log(response)
    } catch(e){console.log(e)}
  }


  useEffect(()=>{console.log(addresses)},[addresses])

  console.log('UserId:', userId);

  const retrieveAddress = async (userId) => {
    try {
      const retrievedAddresses = await getAddress(userId);
      if(!retrieveAddress.exists){
        setAddAddress(true)
      }else{
        setAddresses(retrievedAddresses);  // Set the state with retrieved addresses
      console.log('Retrieved Addresses:', retrievedAddresses);
      }
    } catch (error) {
      console.log('Error fetching addresses:', error);
    }
  };

  useEffect(() => {
    if (loggedIn && userId) {  // Ensure that we only retrieve if the user is logged in and userId is available
      retrieveAddress(userId);
    }
  }, [loggedIn, userId]);  // Run when loggedIn or userId changes

  return (
    <div>
      {setAddAddress && 
      <button onClick={()=>setShowInput(!showInput)}>{buttonText1}</button>
      }
      {showInput && 
      addresses.map((item, index) => (
        <div key={index}>
          <input
            type='text'
            name='address'
            value={item.address}
            onChange={(e) => handleAddressChange(index, 'address', e.target.value)}
            placeholder='Enter address'
          />
          <select
            name='type'
            value={item.type} 
            onChange={(e) => handleAddressChange(index, 'type', e.target.value)}
          >
            <option value='home'>{ES_text.select_home}</option>
            <option value='work'>{ES_text.select_work}</option>
            <option value='other'>{ES_text.select_other}</option>
          </select>
        </div>
      ))}
      <button onClick={addNewAddress}>+</button> {/* Add new address */}
      <button onClick={handleSendAddresses}>enviar</button>
    </div>
  );
};

export default AddressSelector;
