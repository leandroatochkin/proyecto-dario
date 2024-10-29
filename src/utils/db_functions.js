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

export const createCheckout = async (userId, order, address, total, receptor) => {
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
                receptor: receptor
            }))
        };

        const response = await fetch(index.create_checkout, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();
        return data;  // Return the response data if needed
    } catch (e) {
        console.log(e);
    }
};

export const checkUser = async (email) => {
    const userData = { email: email };
    
    try {
        const response = await fetch(index.check_user, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
            //credentials: 'include'
        });

        const data = await response.json();
        localStorage.setItem('authToken', data.token);
        return data; // Expected response: { exists: true/false, userId, token }

    } catch (e) {
        console.error('Error checking user:', e);
        throw new Error('Error checking user');
    }
};

export const registerUser = async (email, phone) => {
    const userData = {
        email: email,
        phone: phone
    };

    try {
        const response = await fetch(index.register_user, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        });

        const data = await response.json();
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