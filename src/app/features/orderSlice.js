import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const orderSlice = createSlice({
  name: "order",
  initialState: {
    data: [],
    isLoading: false,
    error: null,
    currentPage: 1,
    totalPages: 1,
    selectedOrder: null,
  },
  reducers: {
    setOrderData: (state, action) => {
      state.data = action.payload.orders;
      state.totalPages = action.payload.totalPages;
      state.currentPage = action.payload.currentPage;
      state.isLoading = false;
      state.error = null;
    },
    setOrderLoading: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    setOrderError: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    setSelectedOrder: (state, action) => {
      state.selectedOrder = action.payload;
      state.isLoading = false;
      state.error = null;
    },
  },
});

export const {
  setOrderData,
  setOrderLoading,
  setOrderError,
  setSelectedOrder,
} = orderSlice.actions;

// Fetch all categories
export const fetchOrderData =
  (page = 1, filterStatus = "", searchTerm = "") =>
  async (dispatch) => {
    dispatch(setOrderLoading());
    try {
      const response = await axios.get(
        import.meta.env.VITE_BASE_URL + "user/order/getAllOrders",
        {
          params: {
            page,
            limit: 20,
            orderStatus: filterStatus,
            userId: searchTerm,
          },
        }
      );
      const { orders, totalPages } = response.data.data;

      dispatch(
        setOrderData({
          orders,
          totalPages,
          currentPage: page,
        })
      );
    } catch (error) {
      dispatch(setOrderError(error.message));
    }
  };

// Fetch order by ID
export const fetchOrderById = (orderId) => async (dispatch) => {
  dispatch(setOrderLoading());
  try {
    const response = await axios.get(
      import.meta.env.VITE_BASE_URL + `user/order/getOrder/${orderId}`
    );
    dispatch(setSelectedOrder(response.data.data));
  } catch (error) {
    dispatch(setOrderError(error.message));
  }
};

// Fetch order by ID
export const fetchOrderByUserId = (userId) => async (dispatch) => {
  dispatch(setOrderLoading());
  try {
    const response = await axios.get(
      import.meta.env.VITE_BASE_URL + `user/order/getUserOrders/${userId}`
    );
    dispatch(setSelectedOrder(response.data.data));
  } catch (error) {
    dispatch(setOrderError(error.message));
  }
};

// Add a new order (no separate reducer)
export const addOrder = (newOrder) => async (dispatch) => {
  // dispatch(setOrderLoading());
  try {
    await axios.post(
      import.meta.env.VITE_BASE_URL + "user/order/addOrder",
      newOrder
    );
    // Re-fetch categories after adding a new one
    dispatch(fetchOrderData());
  } catch (error) {
    dispatch(setOrderError(error.message));
  }
};

// Edit a order (no separate reducer)
export const editOrder = (orderId, updatedData) => async (dispatch) => {
  // dispatch(setOrderLoading());
  try {
    await axios.put(
      import.meta.env.VITE_BASE_URL + `user/order/updateOrder/${orderId}`,
      updatedData
    );
    // Re-fetch categories after updating
    dispatch(fetchOrderData());
  } catch (error) {
    dispatch(setOrderError(error.message));
  }
};

// Delete a order (no separate reducer)
export const deleteOrder = (orderId) => async (dispatch) => {
  // dispatch(setOrderLoading());
  try {
    await axios.delete(
      import.meta.env.VITE_BASE_URL + `user/order/deleteOrder/${orderId}`
    );
    // Re-fetch categories after deletion
    dispatch(fetchOrderData());
  } catch (error) {
    dispatch(setOrderError(error.message));
  }
};

// Remove a order (no separate reducer)
export const removeOrder = (orderId) => async (dispatch) => {
  dispatch(setOrderLoading());
  try {
    await axios.put(
      import.meta.env.VITE_BASE_URL + `user/order/removeOrder/${orderId}`
    );
    // Re-fetch categories after deletion
    dispatch(fetchOrderData());
  } catch (error) {
    dispatch(setOrderError(error.message));
  }
};

// Selectors
export const selectOrderData = (state) => state.order.data;
export const selectOrderLoading = (state) => state.order.isLoading;
export const selectOrderError = (state) => state.order.error;
export const selectSelectedOrder = (state) => state.order.selectedOrder;
export const selectTotalPages = (state) => state.order.totalPages;

export default orderSlice.reducer;
