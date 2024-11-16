import { createSlice } from "@reduxjs/toolkit";

const initialStateValue = {
  isLoggin: false,

  user: {
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
    "code": "",
  },

};

export const userSlice = createSlice({
  name: "user",
  initialState: { value: initialStateValue },
  reducers: {
    post: (state, action) => {
      state.value.user = action.payload;
    },
    login: (state) => {
      state.isLoggiIn = true;
    },

    generateRegistrationCode: (state) => {
      const randomCode = Math.floor(10000 + Math.random() * 90000);
      state.value.user.code = randomCode.toString();
    },
  },
});

export const { post, generateRegistrationCode, login } = userSlice.actions;
export default userSlice.reducer;
