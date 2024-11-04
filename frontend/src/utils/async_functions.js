import { jwtDecode } from "jwt-decode";
import { registerUser, checkUser } from "./db_functions";
import { index } from ".";


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
  
  export const handleResponse = async (response, phone, setNewUser, setUserId, setLoading, navigate, setBusinessNum, id, navigateToMenuIfId) => {
    const tokenData = jwtDecode(response);
    const email = tokenData.email;

    try {
        setLoading(true); // Start loading
        const registerResponse = await registerUser(email, phone); // Register the user
        
        if (registerResponse.success) {
            setNewUser(false);
            setUserId(true, registerResponse.userId); // Set the returned user ID
            setBusinessNum(id); // Set the businessNum or id for navigation
            
        }

        if(id){
          navigateToMenuIfId()
          console.log('id')
        } else {
          console.log('no id')
          navigate("/");
        }

    } catch (e) {
        console.log("Error registering user:", e);
    } finally {
        setLoading(false); // Stop loading once done
    }
};



export const getServerTime =  async () => {
  try{
    const response = await fetch(index.get_current_time)
    const data = await response.json()
    return data
} catch(e){
    console.log(e)
    return e
}
}

export const sendVerification = async (email, userId) => {
const userData = {
  email: email,
  userId: userId
 };

try {
  const response = await fetch(index.send_verification_email, {
      method: 'POST',
      credentials: 'include',
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
}