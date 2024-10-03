import { create } from 'zustand';

const userStore = create((set) => ({
  loggedIn: false,
  userId: null,

  // Action to set login status and user ID
  setLoginStatus: (status, id) => 
    {console.log("Setting login status:", status, "User ID:", id)
    set({ loggedIn: status, userId: id })},
    
  // Action to log out
  logout: () => set({ loggedIn: false, userId: null }),
}));

export default userStore;
