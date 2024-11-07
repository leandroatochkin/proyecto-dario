import {create} from 'zustand';

export const userStore = create((set) => ({
  loggedIn: false,
  userId: null,
  error: false,
  errorMsg: null,
  tokenData: null || {},
  
  // Function to log in and set the user ID
  setLoginStatus: (status, id) => set({
    loggedIn: status,
    userId: id,
  }),

  setError: (status, error) => set({
    error: status,
    errorMsg: error,
  }),

  setTokenData: (data) => set({
    tokenData: data
  }),
  
  // Function to log out
  logout: () => set({
    loggedIn: false,
    userId: null,
  }),
}));

export const UIStore = create((set)=>({
openModal: false,
loading: true,

setOpenModal: (status) => set({
  openModal: status,
}),

setLoading: (status) => set({
  loading: status,
})
}))
