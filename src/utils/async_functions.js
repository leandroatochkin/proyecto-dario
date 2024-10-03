import { jwtDecode } from "jwt-decode";
import { registerUser, checkUser } from "./db_functions";


export const handleCheck = async (response, setNewUser) => {
    try {
      const tokenData = jwtDecode(response);
      console.log("Checking user:", tokenData.email);
  
      const userExists = await checkUser(tokenData.email);
  
      if (userExists) {
        setNewUser(false);
      } else {
        setNewUser(true);
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // If 404, the user doesn't exist, so it's a new user
        setNewUser(true);
      } else {
        console.log("Error checking user:", error);
        throw error;
      }
    }
  };
  
  export const handleResponse = async (response, phone, setNewUser, navigate) => {
    try {
      const tokenData = jwtDecode(response);
      console.log("Handling response for:", tokenData.email);
  
      // Register new user with phone if they don't exist
      await registerUser(tokenData.email, phone);
      setNewUser(false); // Registration completed
    //   navigate('/menu')
    } catch (error) {
      console.error("Error during user registration:", error);
      throw error;
    }
  };
  