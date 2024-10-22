import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const userSlice = createSlice({
  name: "user",
  initialState: {
    data: [],
    isLoading: false,
    error: null,
    currentPage: 1,
    totalPages: 1,
    selectedUser: null,
  },
  reducers: {
    setUserData: (state, action) => {
      state.data = action.payload.users;
      state.totalPages = action.payload.totalPages;
      state.currentPage = action.payload.currentPage;
      state.isLoading = false;
      state.error = null;
    },
    setUserLoading: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    setUserError: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
      state.isLoading = false;
      state.error = null;
    },
  },
});

export const { setUserData, setUserLoading, setUserError, setSelectedUser } =
  userSlice.actions;

// Fetch all categories
export const fetchUserData =
  (page = 1) =>
  async (dispatch) => {
    dispatch(setUserLoading());
    try {
      const response = await axios.get(
        import.meta.env.VITE_BASE_URL + "user/getAllUsers",
        {
          params: {
            page,
            limit: 20,
          },
        }
      );
      const { users, totalPages } = response.data.data;

      dispatch(setUserData({ users, totalPages, currentPage: page }));
    } catch (error) {
      dispatch(setUserError(error.message));
    }
  };

// Fetch user by ID
export const fetchUserById = (userId) => async (dispatch) => {
  dispatch(setUserLoading());
  try {
    const response = await axios.get(
      import.meta.env.VITE_BASE_URL + `user/getUser/${userId}`
    );
    dispatch(setSelectedUser(response.data.data));
  } catch (error) {
    dispatch(setUserError(error.message));
  }
};

// Add a new user (no separate reducer)
export const addUser = (newUser) => async (dispatch) => {
  try {
    await axios.post(import.meta.env.VITE_BASE_URL + "user/addUser", newUser);
    // Re-fetch categories after adding a new one
    dispatch(fetchUserData());
  } catch (error) {
    dispatch(setUserError(error.message));
  }
};

// Edit a user (no separate reducer)
export const editUser = (id, updatedUser) => async (dispatch) => {
  try {
    await axios.put(
      import.meta.env.VITE_BASE_URL + `user/updateUser/${id}`,
      updatedUser,
      {
        headers: {
          "Content-Type": "application/json", // Set the content type
        },
      }
    );
    // Re-fetch users after updating
    dispatch(fetchUserData());
  } catch (error) {
    dispatch(setUserError(error.message));
  }
};

// Delete a user (no separate reducer)
export const deleteUser = (id) => async (dispatch) => {
  try {
    await axios.delete(import.meta.env.VITE_BASE_URL + `user/deleteUser/${id}`);
    // Re-fetch categories after deletion
    dispatch(fetchUserData());
  } catch (error) {
    dispatch(setUserError(error.message));
  }
};

// Remove a user (no separate reducer)
export const removeUser = (id) => async (dispatch) => {
  try {
    await axios.put(import.meta.env.VITE_BASE_URL + `user/removeUser/${id}`);
    // Re-fetch categories after deletion
    dispatch(fetchUserData());
  } catch (error) {
    dispatch(setUserError(error.message));
  }
};

// Selectors
export const selectUserData = (state) => state.user.data;
export const selectUserLoading = (state) => state.user.isLoading;
export const selectUserError = (state) => state.user.error;
export const selectSelectedUser = (state) => state.user.selectedUser;
export const selectTotalPages = (state) => state.user.totalPages;

export default userSlice.reducer;
