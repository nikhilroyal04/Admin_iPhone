import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const productSlice = createSlice({
  name: "product",
  initialState: {
    data: [],
    isLoading: false,
    error: null,
    currentPage: 1,
    totalPages: 1,
    selectedProduct: null,
  },
  reducers: {
    setProductData: (state, action) => {
      state.data = action.payload.products;
      state.totalPages = action.payload.totalPages;
      state.currentPage = action.payload.currentPage;
      state.isLoading = false;
      state.error = null;
    },
    setProductLoading: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    setProductError: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
      state.isLoading = false;
      state.error = null;
    },
  },
});

export const {
  setProductData,
  setProductLoading,
  setProductError,
  setSelectedProduct,
} = productSlice.actions;

// Fetch all categories
export const fetchProductData =
  (page = 1, selectedCategory = "", searchTerm = "") =>
  async (dispatch) => {
    dispatch(setProductLoading());
    try {
      const response = await axios.get(
        import.meta.env.VITE_BASE_URL + "product/getAllProducts",
        {
          params: {
            page,
            limit: 20,
            categoryName: selectedCategory,
            model: searchTerm,
          },
        }
      );
      const { products, totalPages } = response.data.data;

      dispatch(
        setProductData({
          products,
          totalPages,
          currentPage: page,
        })
      );
    } catch (error) {
      dispatch(setProductError(error.message));
    }
  };

// Fetch product by ID
export const fetchProductById = (id) => async (dispatch) => {
  dispatch(setProductLoading());
  try {
    const response = await axios.get(
      import.meta.env.VITE_BASE_URL + `product/getProductById/${id}`
    );
    dispatch(setSelectedProduct(response.data.data));
  } catch (error) {
    dispatch(setProductError(error.message));
  }
};

// Add a new product (no separate reducer)
export const addProduct = (fd) => async (dispatch) => {
  // dispatch(setProductLoading());
  try {
    await axios.post(import.meta.env.VITE_BASE_URL + "product/addProduct", fd, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    // Re-fetch categories after adding a new one
    dispatch(fetchProductData());
  } catch (error) {
    dispatch(setProductError(error.message));
  }
};

// Edit a product (no separate reducer)
export const editProduct = (id, updatedProduct) => async (dispatch) => {
  // dispatch(setProductLoading());
  try {
    await axios.put(
      `${import.meta.env.VITE_BASE_URL}product/updateProduct/${id}`,
      updatedProduct,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    // Re-fetch categories after updating
    dispatch(fetchProductData());
  } catch (error) {
    dispatch(setProductError(error.message));
  }
};

// Delete a product (no separate reducer)
export const deleteProduct = (productId) => async (dispatch) => {
  dispatch(setProductLoading());
  try {
    await axios.delete(
      import.meta.env.VITE_BASE_URL + `product/deleteProduct/${productId}`
    );
    // Re-fetch categories after deletion
    dispatch(fetchProductData());
  } catch (error) {
    dispatch(setProductError(error.message));
  }
};

// Remove a product (no separate reducer)
export const removeProduct = (productId) => async (dispatch) => {
  dispatch(setProductLoading());
  try {
    await axios.put(
      import.meta.env.VITE_BASE_URL + `product/removeProduct/${productId}`
    );
    // Re-fetch categories after deletion
    dispatch(fetchProductData());
  } catch (error) {
    dispatch(setProductError(error.message));
  }
};

// Selectors
export const selectProductData = (state) => state.product.data;
export const selectProductLoading = (state) => state.product.isLoading;
export const selectProductError = (state) => state.product.error;
export const selectSelectedProduct = (state) => state.product.selectedProduct;
export const selectTotalPages = (state) => state.product.totalPages;

export default productSlice.reducer;
