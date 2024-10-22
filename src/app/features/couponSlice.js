import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const couponSlice = createSlice({
  name: "coupon",
  initialState: {
    data: [],
    isLoading: false,
    error: null,
    currentPage: 1,
    totalPages: 1,
    selectedCoupon: null,
  },
  reducers: {
    setCouponData: (state, action) => {
      state.data = action.payload.coupons;
      state.totalPages = action.payload.totalPages;
      state.currentPage = action.payload.currentPage;
      state.isLoading = false;
      state.error = null;
    },
    setCouponLoading: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    setCouponError: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    setSelectedCoupon: (state, action) => {
      state.selectedCoupon = action.payload;
      state.isLoading = false;
      state.error = null;
    },
  },
});

export const {
  setCouponData,
  setCouponLoading,
  setCouponError,
  setSelectedCoupon,
} = couponSlice.actions;

// Fetch all categories
export const fetchCouponData =
  (page = 1) =>
  async (dispatch) => {
    dispatch(setCouponLoading());
    try {
      const response = await axios.get(
        import.meta.env.VITE_BASE_URL + "coupon/getAllCoupons",
        {
          params: {
            page,
            limit: 20,
          },
        }
      );
      const { coupons, totalPages } = response.data.data;

      dispatch(
        setCouponData({
          coupons,
          totalPages,
          currentPage: page,
        })
      );
    } catch (error) {
      dispatch(setCouponError(error.message));
    }
  };

// Fetch coupon by ID
export const fetchCouponById = (couponId) => async (dispatch) => {
  dispatch(setCouponLoading());
  try {
    const response = await axios.get(
      import.meta.env.VITE_BASE_URL + `coupon/getCoupon/${couponId}`
    );
    dispatch(setSelectedCoupon(response.data.data));
  } catch (error) {
    dispatch(setCouponError(error.message));
  }
};

// Add a new coupon (no separate reducer)
export const addCoupon = (couponData) => async (dispatch) => {
  // dispatch(setCouponLoading());
  try {
    await axios.post(
      import.meta.env.VITE_BASE_URL + "coupon/addCoupon",
      couponData
    );
    // Re-fetch categories after adding a new one
    dispatch(fetchCouponData());
  } catch (error) {
    dispatch(setCouponError(error.message));
  }
};

// Edit a coupon (no separate reducer)
export const editCoupon = (couponId, updatedData) => async (dispatch) => {
  // dispatch(setCouponLoading());
  try {
    await axios.put(
      import.meta.env.VITE_BASE_URL + `coupon/updateCoupon/${couponId}`,
      updatedData
    );
    // Re-fetch categories after updating
    dispatch(fetchCouponData());
  } catch (error) {
    dispatch(setCouponError(error.message));
  }
};

// Delete a coupon (no separate reducer)
export const deleteCoupon = (couponId) => async (dispatch) => {
  // dispatch(setCouponLoading());
  try {
    await axios.delete(
      import.meta.env.VITE_BASE_URL + `coupon/deleteCoupon/${couponId}`
    );
    // Re-fetch categories after deletion
    dispatch(fetchCouponData());
  } catch (error) {
    dispatch(setCouponError(error.message));
  }
};

// Remove a coupon (no separate reducer)
export const removeCoupon = (couponId) => async (dispatch) => {
  // dispatch(setCouponLoading());
  try {
    await axios.put(
      import.meta.env.VITE_BASE_URL + `coupon/removeCoupon/${couponId}`
    );
    // Re-fetch categories after deletion
    dispatch(fetchCouponData());
  } catch (error) {
    dispatch(setCouponError(error.message));
  }
};

// Selectors
export const selectCouponData = (state) => state.coupon.data;
export const selectCouponLoading = (state) => state.coupon.isLoading;
export const selectCouponError = (state) => state.coupon.error;
export const selectSelectedCoupon = (state) => state.coupon.selectedCoupon;
export const selectTotalPages = (state) => state.coupon.totalPages;

export default couponSlice.reducer;
