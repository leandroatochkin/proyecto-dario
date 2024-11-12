import { index } from "."


export const getProducts = async(raz_soc) =>{
    try{

        const payload = {raz_social: raz_soc}
        const response = await fetch(index.request_products, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });
        const data = await response.json();
        return data;
    } catch(e){
        console.log(e)
        return e
    }
}

export const getCategories = async(raz_soc) =>{

    try{

        const payload = {raz_social: raz_soc}
        const response = await fetch(index.request_categories, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });
        const data = await response.json();
        return data;
    } catch(e){
        console.log(e)
        return e
    }
}

// export const createCheckout = async (userId, order, address, total, receptor, commentary) => {

//     try {
//         const payload = {
//             orderData: order.map((product) => ({
//                 user_Id: userId,
//                 PD_cod_raz_soc: product.PD_cod_raz_soc,
//                 PD_cod_suc: product.PD_cod_suc,
//                 PD_cod_pro: product.PD_cod_pro,
//                 PD_pre_ven: product.PD_pre_ven,
//                 quantity: product.quantity,
//                 address: address.address,
//                 type: address.type,
//                 total: total,
//                 state: 1,
//                 receptor: receptor,
//                 commentary: commentary
//             }))
//         };

//         const response = await fetch(index.create_checkout, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(payload),
//         });

//         const data = await response.json();
//         return data;  // Return the response data if needed
//     } catch (e) {
//         console.log(e);
//     }
// };

// Import your index object if needed
// import index from 'path-to-your-index-file';

export const createCheckout = async (userId, order, address, total, receptor, commentary) => {
    try {
        const payload = {
            orderData: order.map((product) => ({
                user_Id: userId,
                PD_cod_raz_soc: product.PD_cod_raz_soc,
                PD_cod_suc: product.PD_cod_suc,
                PD_cod_pro: product.PD_cod_pro,
                PD_pre_ven: product.PD_pre_ven,
                quantity: product.quantity,
                address: address.address,
                type: address.type,
                total: total,
                state: 1,
                receptor: receptor,
                commentary: commentary
            }))
        };

        // Fetch both endpoints in parallel
        const [response1, response2] = await Promise.all([
            fetch(index.create_checkout, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            }),
            fetch('https://7105xlt6-8080.brs.devtunnels.ms/checkout', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            })
        ]);

        // Check if both responses are OK
        if (response1.ok && response2.ok) {
            const data1 = await response1.json();
            const data2 = await response2.json();
            return { data1, data2 }; // Return data from both endpoints if needed
        } else {
            console.error('One or both requests failed', response1.status, response2.status);
            throw new Error('One or both requests failed');
        }

    } catch (error) {
        console.error('Error in createCheckout:', error);
    }
};


export const checkUser = async (email) => {
    const userData = { email: email.toLowerCase() };
    
    try {
        const response = await fetch(index.check_user, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
            //credentials: 'include'
        });

        const data = await response.json();
        //localStorage.setItem('authToken', data.token);
        return data; // Expected response: { exists: true/false, userId, token }

    } catch (e) {
        console.error('Error checking user:', e);
        throw new Error('Error checking user');
    }
};

export const loginUser = async (email, password) => {
    const userData = { 
        email: email.toLowerCase(),
        password: password };

    
    try {
        const response = await fetch(index.login_user, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
            //credentials: 'include'
        });

        const data = await response.json();
        //localStorage.setItem('authToken', data.token);
        return data; // Expected response: { success: true }

    } catch (e) {
        console.error('Error checking user:', e);
        throw new Error('Error checking user');
    }
};

export const registerUser = async (email, password, phone, isGoogle) => {
    const userData = {
        email: email.toLowerCase(),
        password: password,
        phone: phone,
        role: 'user',
        isGoogle: isGoogle,
     };
    try {
        const response = await fetch(index.register_user, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        });

        const data = await response.json();
        console.log(data)
        return data; // Expected response: { success: true, userId, token }

    } catch (e) {
        console.error('Error registering user:', e);
        throw new Error('Error registering user');
    }
};

export const addAddress = async(userId, addresses) => {

    const addressData = {
        userId: userId,
        addresses: addresses
    }

    try{
        const response = await fetch(index.add_address, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(addressData)
                })
                const data = await response.json()
                return data
            }
            catch(e){
                console.log(e)
                throw e
            }
}

export const getAddress = async(userId) => {

    const addressData = {
        userId: userId
    }

    try{
        const response = await fetch(index.get_address, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(addressData)
                })
                const data = await response.json()
                return data
            }
            catch(e){
                console.log(e)
                throw e
            }
}

export const getBusinesses = async() =>{
    try{
        const response = await fetch(index.get_businesses)
        const data = await response.json()
        return data
    } catch(e){
        console.log(e)
        return e
    }
}

export const getBusinessesNumber = async(id) =>{
    try{

        const payload = {id: id}
        const response = await fetch(index.get_business_number, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });
        const data = await response.json();
        return data;
    } catch(e){
        console.log(e)
        return e
    }
}

export const getBusinessesDetails = async(razSoc) =>{
    try{

        const payload = {razSoc: razSoc}
        const response = await fetch(index.get_business_details, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });
        const data = await response.json();
        return data;
    } catch(e){
        console.log(e)
        return e
    }
}

export const deleteUser = async (userId) => {
    const payload = {
        userId: userId
    };

    try {
        const response = await fetch(index.delete_user, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        return data; // Expected response: { success: true }

    } catch (e) {
        console.error('Error deleting user:', e);
        throw new Error('Error deleting user');
    }
};

export const getSchedule = async(branchId) =>{
    try{

        const payload = {id: branchId}
        const response = await fetch(index.get_schedule, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });
        const data = await response.json();
        return data;
    } catch(e){
        console.log(e)
        return e
    }
};

export const deleteAddress = async (userId, addressId) => {
    const payload = {
        userId: userId,
        addressId: addressId
    };

    try {
        const response = await fetch(index.delete_address, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });
 
        const data = await response.json();
        return data; // Expected response: { success: true }

    } catch (e) {
        console.error('Error deleting user:', e);
        throw new Error('Error deleting user');
    }
};

export const verifyEmail = async (userId) => {
    const payload = {
        userId: userId,
    };

    try {
        const response = await fetch(index.verify_email, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });
 
        const data = await response.json();
        return data; // Expected response: { success: true }

    } catch (e) {
        console.error('Error deleting user:', e);
        throw new Error('Error deleting user');
    }
};