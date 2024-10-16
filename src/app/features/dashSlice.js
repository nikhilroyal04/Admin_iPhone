import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const dashSlice = createSlice({
  name: "dashboard",
  initialState: {
    data: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    setDashboardData: (state, action) => {
      state.data = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setDashboardLoading: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    setDashboardError: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const { setDashboardData, setDashboardLoading, setDashboardError } =
  dashSlice.actions;

// Fetch dashboard data
export const fetchDashboardData = () => async (dispatch) => {
  dispatch(setDashboardLoading());
  try {
    const response = await axios.get(
      import.meta.env.VITE_BASE_URL + "dashboard/getData"
    );
    dispatch(setDashboardData(response.data.data)); 
  } catch (error) {
    dispatch(setDashboardError(error.message));
  }
};

// Selectors
export const selectDashboardData = (state) => state.dashboard.data;
export const selectDashboardLoading = (state) => state.dashboard.isLoading;
export const selectDashboardError = (state) => state.dashboard.error;

export default dashSlice.reducer;
