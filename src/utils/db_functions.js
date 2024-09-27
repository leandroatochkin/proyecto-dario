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
