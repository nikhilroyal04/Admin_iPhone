import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null, // Retrieve user from localStorage on initialization
  isLoading: false,
  error: null,
  isLoggedIn: !!localStorage.getItem("user"), // Check if user exists in localStorage
};

const authSlice = createSlice({
  name: "auth",
  initialState,
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
      // Store user in local storage
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    setLogout: (state) => {
      state.user = null;
      state.isLoading = false;
      state.isLoggedIn = false;
      state.error = null;
      // Remove user from local storage
      localStorage.removeItem("user");
    },
    setLoginError: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    setUserProfile: (state, action) => {
      state.user = action.payload;
      // Update user in local storage
      localStorage.setItem("user", JSON.stringify(action.payload));
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
export const fetchUserProfile = (token) => async (dispatch) => {
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

    // Check if the user status is inactive or role status is inactive
    if (userData.status === "Inactive") {
      dispatch(setLoginError("User account is inactive."));
    } else if (userData.roleAttribute.status == "Inactive") {
      dispatch(setLoginError("Role is no longer active."));
    } else {
      dispatch(setUserProfile(userData));
    }
  } catch (error) {
    dispatch(setLoginError("Invalid credentials. Please try again."));
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
    dispatch(setLoginSuccess(null));

    // Fetch user profile after successful login
    dispatch(fetchUserProfile(token));
  } catch (error) {
    dispatch(setLoginError("Invalid credentials. Please try again."));
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
