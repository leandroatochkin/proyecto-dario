import {create} from 'zustand';
import { ES_text } from './text_scripts';


export const userStore = create((set) => ({
  loggedIn: false,
  userId: null,
  error: false,
  errorMsg: null,
  tokenData: null || {},
  city: '',

  
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

  setCity: (newCity) => set({
    city: newCity,
  }),
}));

export const UIStore = create((set)=>({
language: ES_text,
openModal: false,
loading: true,
globalOpenModal: false,
openErrorModal: false,
error: '',
needsDelivery: true,

setLanguage: (language) => set({
  language: language,
}),

setOpenModal: (status) => set({
  openModal: status,
}),

setGlobalOpenModal: (status) => set({
  globalOpenModal: status,
}),

setLoading: (status) => set({
  loading: status,
}),

setOpenErrorModal: (status) => set({
  openErrorModal: status,
}),

setError: (msg) => set({
  error: msg,
}),

setNeedsDelivery: (status) => set({
  needsDelivery: status,
}),
}))

export const businessDataStore = create((set) => ({
  currentOrder: [],


  
  // Function to log in and set the user ID
  setCurrentOrder: (data) => set({
    currentOrder: data,
  }),

}));