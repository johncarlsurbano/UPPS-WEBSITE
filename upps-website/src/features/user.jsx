import { createSlice } from "@reduxjs/toolkit";

const initialStateValue = {
  isLoggin: false,

  user: {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    day: 0,
    month: "",
    year: 0,
    department: "",
    position: "",
    streetAddress: "",
    barangay: "",
    city: "",
    zipCode: 0,
    registrationCode: "",
  },
};

export const userSlice = createSlice({
  name: "user",
  initialState: { value: initialStateValue },
  reducers: {
    post: (state) => {
      state.value;
    },
    login: (state, action) => {
      state.value = action.payload;
      state.isLoggingIn = true;
    },

    generateRegistrationCode: (state) => {
      const randomCode = Math.floor(10000 + Math.random() * 90000);
      state.value.registrationCode = randomCode.toString();
    },
  },
});

export const { post, generateRegistrationCode, login } = userSlice.actions;
export default userSlice.reducer;
