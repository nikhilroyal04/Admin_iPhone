import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const categorySlice = createSlice({
  name: "category",
  initialState: {
    data: [],
    isLoading: false,
    error: null,
    selectedCategory: null, // State for fetching a category by ID
  },
  reducers: {
    setCategoryData: (state, action) => {
      state.data = action.payload.categories;
      state.isLoading = false;
      state.error = null;
    },
    setCategoryLoading: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    setCategoryError: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
      state.isLoading = false;
      state.error = null;
    },
  },
});

export const {
  setCategoryData,
  setCategoryLoading,
  setCategoryError,
  setSelectedCategory,
} = categorySlice.actions;

// Fetch all categories
export const fetchCategoryData = () => async (dispatch) => {
  dispatch(setCategoryLoading());
  try {
    const response = await axios.get(
      import.meta.env.VITE_BASE_URL + "category/getAllCategories"
    );
    dispatch(setCategoryData(response.data.data));
  } catch (error) {
    dispatch(setCategoryError(error.message));
  }
};

// Fetch category by ID
export const fetchCategoryById = (categoryId) => async (dispatch) => {
  dispatch(setCategoryLoading());
  try {
    const response = await axios.get(
      import.meta.env.VITE_BASE_URL + `category/getCategory/${categoryId}`
    );
    dispatch(setSelectedCategory(response.data.data));
  } catch (error) {
    dispatch(setCategoryError(error.message));
  }
};

// Add a new category (no separate reducer)
export const addCategory = (newCategory) => async (dispatch) => {
  // dispatch(setCategoryLoading());
  try {
    await axios.post(
      import.meta.env.VITE_BASE_URL + "category/addCategory",
      newCategory
    );
    // Re-fetch categories after adding a new one
    dispatch(fetchCategoryData());
  } catch (error) {
    dispatch(setCategoryError(error.message));
  }
};

// Edit a category (no separate reducer)
export const editCategory = (id, formData) => async (dispatch) => {
  // dispatch(setCategoryLoading());
  try {
    await axios.put(
      import.meta.env.VITE_BASE_URL + `category/updateCategory/${id}`,
      formData
    );
    // Re-fetch categories after updating
    dispatch(fetchCategoryData());
  } catch (error) {
    dispatch(setCategoryError(error.message));
  }
};

// Delete a category (no separate reducer)
export const deleteCategory = (categoryId) => async (dispatch) => {
  dispatch(setCategoryLoading());
  try {
    await axios.delete(
      import.meta.env.VITE_BASE_URL + `category/deleteCategory/${categoryId}`
    );
    // Re-fetch categories after deletion
    dispatch(fetchCategoryData());
  } catch (error) {
    dispatch(setCategoryError(error.message));
  }
};

// Remove a category (no separate reducer)
export const removeCategory = (categoryId) => async (dispatch) => {
  // dispatch(setCategoryLoading());
  try {
    await axios.put(
      import.meta.env.VITE_BASE_URL + `category/removeCategory/${categoryId}`
    );
    // Re-fetch categories after deletion
    dispatch(fetchCategoryData());
  } catch (error) {
    dispatch(setCategoryError(error.message));
  }
};

// Selectors
export const selectCategoryData = (state) => state.category.data;
export const selectCategoryLoading = (state) => state.category.isLoading;
export const selectCategoryError = (state) => state.category.error;
export const selectSelectedCategory = (state) => state.category.selectedCategory;

export default categorySlice.reducer;
