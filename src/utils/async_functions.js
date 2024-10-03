import { jwtDecode } from "jwt-decode";
import { registerUser, checkUser } from "./db_functions";


export const handleCheck = async (response, setNewUser, setUserId) => {
    try {
      const tokenData = jwtDecode(response);
      console.log("Checking user:", tokenData.email);
  
      const {exists, userId} = await checkUser(tokenData.email);

      console.log(userExists)
        
      if (exists) {
        setUserId(userId);
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
  
  export const handleResponse = async (response, phone, setNewUser, setUserId, navigate) => {
    const tokenData = jwtDecode(response);
    const email = tokenData.email;

    try {
        const registerResponse = await registerUser(email, phone); // Call the registerUser function

        if (registerResponse.success) {
            setNewUser(false);
            setUserId(registerResponse.userId); // Set the returned user ID
            navigate("/menu");
        }
    } catch (e) {
        console.log("Error registering user:", e);
    }
};
