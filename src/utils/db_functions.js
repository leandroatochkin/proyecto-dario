import { index } from "."

export const getProducts = async() =>{
    try{
        const response = await fetch(index.request_products)
        const data = await response.json()

        return data
    } catch(e){
        console.log(e)
    }
}

export const getCategories = async() =>{
    try{
        const response = await fetch(index.request_categories)
        const data = await response.json()
        return data
    } catch(e){
        console.log(e)
    }
}

export const createCheckout = async (order, address) => {
    try {
        const payload = {
            orderData: order.map((product) => ({
                PD_cod_raz_soc: product.PD_cod_raz_soc,
                PD_cod_suc: product.PD_cod_suc,
                PD_cod_pro: product.PD_cod_pro,
                PD_pre_ven: product.PD_pre_ven,
                quantity: product.quantity,
                address: address.address,
                type: address.type,
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

export const registerUser = async(email, phone) => {

    const userData = {
        email: email,
        phone: phone
    }

    try{
        const response = await fetch(index.register_user, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData)
                })
                const data = await response.json()
                return data
            }
            catch(e){
                console.log(e)
                throw e
            }
}

export const checkUser = async (email) => {
    const userData = { email: email };
    
    try {
        const response = await fetch(index.check_user, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        });

        const data = await response.json();
        return data; // return true or false based on the server response

    } catch (e) {
        console.log('Error checking user:', e);
        throw new Error('Error checking user'); // Catch actual errors here
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