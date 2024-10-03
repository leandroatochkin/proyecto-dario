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

export const createCheckout = async(order) => {
    try{
        const response = await fetch(index.create_checkout, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(order)
                })
                const data = await response.json()
            }
            catch(e){
                console.log(e)
            }
}

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
            }
            catch(e){
                console.log(e)
            }
}

export const checkUser = async (email) => {
    const userData = {
        email: email,
    };
    
    try {
        const response = await fetch(index.check_user, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        });

        // Assuming the backend returns a JSON response with a status field (e.g., user exists or not)
        const data = await response.json();

        // Check the response from the server to determine if the user exists
        if (data.exists) {
            return true; // User exists
        } else {
            return false; // User does not exist
        }

    } catch (e) {
        console.log('Error checking user:', e);
        return false; // In case of error, assume user does not exist
    }
};

