import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isLoading: false,
    error: null,
    isLoggedIn: false,
  },
  reducers: {
    setLoginLoading: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    setLoginSuccess: (state, action) => {
      state.user = action.payload;
      state.isLoading = false;
      state.isLoggedIn = true;
      state.error = null;
    },
    setLogout: (state) => {
      state.user = null;
      state.isLoading = false;
      state.isLoggedIn = false;
      state.error = null;
    },
    setLoginError: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    setUserProfile: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const {
  setLoginLoading,
  setLoginSuccess,
  setLogout,
  setLoginError,
  setUserProfile,
} = authSlice.actions;

// Helper function to fetch the user profile
const fetchUserProfile = (token) => async (dispatch) => {
  dispatch(setLoginLoading());
  try {
    const response = await axios.get(
      import.meta.env.VITE_BASE_URL + "get/profile",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const userData = response.data.data;

    dispatch(setUserProfile(userData));
  } catch (error) {
    dispatch(setLoginError(error.response?.data?.message || error.message));
  }
};

export const loginUser = (credentials) => async (dispatch) => {
  dispatch(setLoginLoading());
  try {
    const response = await axios.post(
      import.meta.env.VITE_BASE_URL + "auth/login",
      credentials
    );

    const { token } = response.data.data;
    localStorage.setItem("userToken", token);
    dispatch(setLoginSuccess(null));

    // Fetch user profile after successful login
    dispatch(fetchUserProfile(token));
  } catch (error) {
    dispatch(setLoginError(error.message));
  }
};

export const logoutUser = () => (dispatch) => {
  localStorage.removeItem("userToken");
  dispatch(setLogout());
};

export const selectUser = (state) => state.auth.user;
export const selectIsLoading = (state) => state.auth.isLoading;
export const selectError = (state) => state.auth.error;
export const selectIsLoggedIn = (state) => state.auth.isLoggedIn;

export default authSlice.reducer;
