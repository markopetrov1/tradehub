import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  userLoading: false,
  userItems: [],
  favouriteItems: [],
  userExchanges: [],
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setUserLoading: (state, action) => {
      state.userLoading = action.payload;
    },
    setUserItems: (state, action) => {
      state.userItems = action.payload;
    },
    setFavouriteItems: (state, action) => {
      state.favouriteItems = action.payload;
    },
    setUserExchanges: (state, action) => {
      state.userExchanges = action.payload;
    },
  },
});

export const {
  setUser,
  setUserLoading,
  setUserItems,
  setFavouriteItems,
  setUserExchanges,
} = userSlice.actions;

export default userSlice.reducer;