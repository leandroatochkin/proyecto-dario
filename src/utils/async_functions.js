import { jwtDecode } from "jwt-decode";
import { registerUser, checkUser } from "./db_functions";


export const handleCheck = (response, setNewUser) => {
    const tokenData = jwtDecode(response);
    console.log(tokenData.email)
    if(checkUser(tokenData.email)){
        setNewUser(false)
    } else {
        setNewUser(true)
    }
}


export const handleResponse = (response, phone, setNewUser) => {

    const tokenData = jwtDecode(response);
    console.log(tokenData)

  
    if(checkUser(tokenData.email)){
        setNewUser(false)

    } else {
        registerUser(tokenData.email, phone)
    }
  

  }