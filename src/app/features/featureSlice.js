import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const featureSlice = createSlice({
  name: "feature",
  initialState: {
    data: [],
    isLoading: false,
    error: null,
    selectedFeature: null, // State for fetching a feature by ID
  },
  reducers: {
    setFeatureData: (state, action) => {
      state.data = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setFeatureLoading: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    setFeatureError: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    setSelectedFeature: (state, action) => {
      state.selectedFeature = action.payload;
      state.isLoading = false;
      state.error = null;
    },
  },
});

export const {
  setFeatureData,
  setFeatureLoading,
  setFeatureError,
  setSelectedFeature,
} = featureSlice.actions;

// Fetch all categories
export const fetchFeatureData = () => async (dispatch) => {
  dispatch(setFeatureLoading());
  try {
    const response = await axios.get(
      import.meta.env.VITE_BASE_URL + "feature/getAllFeatures"
    );
    dispatch(setFeatureData(response.data.data));
  } catch (error) {
    dispatch(setFeatureError(error.message));
  }
};

// Fetch feature by ID
export const fetchFeatureById = (featureId) => async (dispatch) => {
  dispatch(setFeatureLoading());
  try {
    const response = await axios.get(
      import.meta.env.VITE_BASE_URL + `feature/getFeature/${featureId}`
    );
    dispatch(setSelectedFeature(response.data.data));
  } catch (error) {
    dispatch(setFeatureError(error.message));
  }
};

// Add a new feature (no separate reducer)
export const addFeature = (newFeature) => async (dispatch) => {
  // dispatch(setFeatureLoading());
  try {
    await axios.post(
      import.meta.env.VITE_BASE_URL + "feature/addFeature",
      newFeature
    );
    // Re-fetch categories after adding a new one
    dispatch(fetchFeatureData());
  } catch (error) {
    dispatch(setFeatureError(error.message));
  }
};

// Edit a feature (no separate reducer)
export const editFeature = (featureId, updatedData) => async (dispatch) => {
  // dispatch(setFeatureLoading());
  console.log("id",featureId);
  console.log("data fir update",updatedData);
  try {
    await axios.put(
      import.meta.env.VITE_BASE_URL + `feature/updateFeature/${featureId}`,
      updatedData
    );
    // Re-fetch categories after updating
    dispatch(fetchFeatureData());
  } catch (error) {
    dispatch(setFeatureError(error.message));
  }
};

// Delete a feature (no separate reducer)
export const deleteFeature = (featureId) => async (dispatch) => {
  // dispatch(setFeatureLoading());
  try {
    await axios.delete(
      import.meta.env.VITE_BASE_URL + `feature/deleteFeature/${featureId}`
    );
    // Re-fetch categories after deletion
    dispatch(fetchFeatureData());
  } catch (error) {
    dispatch(setFeatureError(error.message));
  }
};

// Remove a feature (no separate reducer)
export const removeFeature = (featureId) => async (dispatch) => {
  // dispatch(setFeatureLoading());
  try {
    await axios.put(
      import.meta.env.VITE_BASE_URL + `feature/removeFeature/${featureId}`
    );
    // Re-fetch categories after deletion
    dispatch(fetchFeatureData());
  } catch (error) {
    dispatch(setFeatureError(error.message));
  }
};

// Selectors
export const selectFeatureData = (state) => state.feature.data;
export const selectFeatureLoading = (state) => state.feature.isLoading;
export const selectFeatureError = (state) => state.feature.error;
export const selectSelectedFeature = (state) => state.feature.selectedFeature;

export default featureSlice.reducer;
