import {create} from 'zustand';

const userStore = create((set) => ({
  loggedIn: false,
  userId: null,
  error: false,
  errorMsg: null,
  
  // Function to log in and set the user ID
  setLoginStatus: (status, id) => set({
    loggedIn: status,
    userId: id,
  }),

  setError: (status, error) => set({
    error: status,
    errorMsg: error,
  }),
  
  // Function to log out
  logout: () => set({
    loggedIn: false,
    userId: null,
  }),
}));

export default userStore;
