import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const addressSlice = createSlice({
  name: "address",
  initialState: {
    data: [],
    isLoading: false,
    error: null,
    currentPage: 1,
    totalPages: 1,
    selectedAddress: null, // State for fetching a address by ID
  },
  reducers: {
    setAddressData: (state, action) => {
      state.data = action.payload.addresses;
      state.totalPages = action.payload.totalPages;
      state.currentPage = action.payload.currentPage;
      state.isLoading = false;
      state.error = null;
    },
    setAddressLoading: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    setAddressError: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    setSelectedAddress: (state, action) => {
      state.selectedAddress = action.payload;
      state.isLoading = false;
      state.error = null;
    },
  },
});

export const {
  setAddressData,
  setAddressLoading,
  setAddressError,
  setSelectedAddress,
} = addressSlice.actions;

// Fetch all categories
export const fetchAddressData =
  (page = 1) =>
  async (dispatch) => {
    dispatch(setAddressLoading());
    try {
      const response = await axios.get(
        import.meta.env.VITE_BASE_URL + "user/address/getAllAddresses",
        {
          params: {
            page,
            limit: 20,
          },
        }
      );
      const { addresses, totalPages } = response.data.data;

      dispatch(
        setAddressData({
          addresses,
          totalPages,
          currentPage: page,
        })
      );
    } catch (error) {
      dispatch(setAddressError(error.message));
    }
  };

// Fetch address by ID
export const fetchAddressById = (addressId) => async (dispatch) => {
  dispatch(setAddressLoading());
  try {
    const response = await axios.get(
      import.meta.env.VITE_BASE_URL + `user/address/getAddress/${addressId}`
    );
    dispatch(setSelectedAddress(response.data.data));
  } catch (error) {
    dispatch(setAddressError(error.message));
  }
};

// Fetch address by ID
export const fetchAddressByUserId = (userId) => async (dispatch) => {
  dispatch(setAddressLoading());
  try {
    const response = await axios.get(
      import.meta.env.VITE_BASE_URL + `user/address/getUserAddresss/${userId}`
    );
    dispatch(setSelectedAddress(response.data.data));
  } catch (error) {
    dispatch(setAddressError(error.message));
  }
};

// Add a new address (no separate reducer)
export const addAddress = (newAddress) => async (dispatch) => {
  // dispatch(setAddressLoading());
  try {
    await axios.post(
      import.meta.env.VITE_BASE_URL + "user/address/addAddress",
      newAddress
    );
    // Re-fetch categories after adding a new one
    dispatch(fetchAddressData());
  } catch (error) {
    dispatch(setAddressError(error.message));
  }
};

// Edit a address (no separate reducer)
export const editAddress = (addressId, updatedData) => async (dispatch) => {
  // dispatch(setAddressLoading());
  try {
    await axios.put(
      import.meta.env.VITE_BASE_URL + `user/address/updateAddress/${addressId}`,
      updatedData
    );
    // Re-fetch categories after updating
    dispatch(fetchAddressData());
  } catch (error) {
    dispatch(setAddressError(error.message));
  }
};

// Delete a address (no separate reducer)
export const deleteAddress = (addressId) => async (dispatch) => {
  // dispatch(setAddressLoading());
  try {
    await axios.delete(
      import.meta.env.VITE_BASE_URL + `user/address/deleteAddress/${addressId}`
    );
    // Re-fetch categories after deletion
    dispatch(fetchAddressData());
  } catch (error) {
    dispatch(setAddressError(error.message));
  }
};

// Remove a address (no separate reducer)
export const removeAddress = (addressId) => async (dispatch) => {
  // dispatch(setAddressLoading());
  try {
    await axios.put(
      import.meta.env.VITE_BASE_URL + `user/address/removeAddress/${addressId}`
    );
    // Re-fetch categories after deletion
    dispatch(fetchAddressData());
  } catch (error) {
    dispatch(setAddressError(error.message));
  }
};

// Selectors
export const selectAddressData = (state) => state.address.data;
export const selectAddressLoading = (state) => state.address.isLoading;
export const selectAddressError = (state) => state.address.error;
export const selectSelectedAddress = (state) => state.address.selectedAddress;
export const selectTotalPages = (state) => state.address.totalPages;

export default addressSlice.reducer;
