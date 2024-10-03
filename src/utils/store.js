import {create} from 'zustand';

const userStore = create((set) => ({
  loggedIn: false,
  userId: null,
  
  // Function to log in and set the user ID
  setLoginStatus: (status, id) => set({
    loggedIn: status,
    userId: id,
  }),
  
  // Function to log out
  logout: () => set({
    loggedIn: false,
    userId: null,
  }),
}));

export default userStore;
