import { createSlice } from "@reduxjs/toolkit";
import { useLocalStorage } from "../hooks/useLocalStorage";

const {setItem, getItem, removeItem} = useLocalStorage("user")

const initialStateValue = {
  isLoggin: false,

  user: {
    "id": "",
    "first_name": "",
    "last_name": "",
    "email": "",
    "password": "",
    "confirmpassword": "",
    "day": "",
    "month": "",
    "year": "",
    "city": "",
    "barangay": "",
    "zipcode": "",
    "street_address": "",
    "department": "",
    "position": "",
    "code": null,
  },

};


export const userSlice = createSlice({
  name: "user",
  initialState: { value: initialStateValue },
  reducers: {
    post: (state, action) => {
      state.value.user = action.payload;
    },
    login: (state, action) => {
      state.value.isLoggin = true;
      state.value.user = action.payload;
      // const existingUsers = getItem(); // Get the current list of users
      // setItem(action.payload); // Add the new user to the localStorage
    },
    generateRegistrationCode: (state, action) => {
      state.value.user.code = action.payload; 
    },
    logout: (state) => {
      state.value.isLoggin = false;
      const loggedOutUser = state.value.user;
      // const existingUsers = getItem(); // Get the current list of users

      // Filter out the logged-out user from the array of users
      // const updatedUsers = existingUsers.filter(user => user.id !== loggedOutUser.id);
      
      // Update the localStorage with the filtered array
      // setItem(updatedUsers);

      // Reset the state for the logged-out user
      state.value.user = initialStateValue.user;
    },
    updateUserData: (state, action) => {
      state.value.user = { ...state.value.user, ...action.payload };
    },
    setEmail: (state, action) => {
      state.value.user.email = action.payload; // Save the email
    },
  },
});

export const { post, generateRegistrationCode, login, logout, updateUserData, setEmail } = userSlice.actions;
export default userSlice.reducer;
