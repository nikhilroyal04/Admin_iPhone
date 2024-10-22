import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const roleSlice = createSlice({
  name: "role",
  initialState: {
    data: [],
    isLoading: false,
    error: null,
    selectedRole: null, // State for fetching a role by ID
  },
  reducers: {
    setRoleData: (state, action) => {
      state.data = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setRoleLoading: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    setRoleError: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    setSelectedRole: (state, action) => {
      state.selectedRole = action.payload;
      state.isLoading = false;
      state.error = null;
    },
  },
});

export const {
  setRoleData,
  setRoleLoading,
  setRoleError,
  setSelectedRole,
} = roleSlice.actions;

// Fetch all categories
export const fetchRoleData = () => async (dispatch) => {
  dispatch(setRoleLoading());
  try {
    const response = await axios.get(
      import.meta.env.VITE_BASE_URL + "role/getAllRoles"
    );
    dispatch(setRoleData(response.data.data));
  } catch (error) {
    dispatch(setRoleError(error.message));
  }
};

// Fetch role by ID
export const fetchRoleById = (roleId) => async (dispatch) => {
  dispatch(setRoleLoading());
  try {
    const response = await axios.get(
      import.meta.env.VITE_BASE_URL + `role/getRole/${roleId}`
    );
    dispatch(setSelectedRole(response.data.data));
  } catch (error) {
    dispatch(setRoleError(error.message));
  }
};

// Add a new role (no separate reducer)
export const addRole = (newRole) => async (dispatch) => {
  // dispatch(setRoleLoading());
  try {
    await axios.post(
      import.meta.env.VITE_BASE_URL + "role/addRole",
      newRole
    );
    // Re-fetch categories after adding a new one
    dispatch(fetchRoleData());
  } catch (error) {
    dispatch(setRoleError(error.message));
  }
};

// Edit a role (no separate reducer)
export const editRole = (roleId, updatedData) => async (dispatch) => {
  // dispatch(setRoleLoading());
  try {
    await axios.put(
      import.meta.env.VITE_BASE_URL + `role/updateRole/${roleId}`,
      updatedData
    );
    // Re-fetch categories after updating
    dispatch(fetchRoleData());
  } catch (error) {
    dispatch(setRoleError(error.message));
  }
};

// Delete a role (no separate reducer)
export const deleteRole = (roleId) => async (dispatch) => {
  // dispatch(setRoleLoading());
  try {
    await axios.delete(
      import.meta.env.VITE_BASE_URL + `role/deleteRole/${roleId}`
    );
    // Re-fetch categories after deletion
    dispatch(fetchRoleData());
  } catch (error) {
    dispatch(setRoleError(error.message));
  }
};

// Remove a role (no separate reducer)
export const removeRole = (roleId) => async (dispatch) => {
  // dispatch(setRoleLoading());
  try {
    await axios.put(
      import.meta.env.VITE_BASE_URL + `role/removeRole/${roleId}`
    );
    // Re-fetch categories after deletion
    dispatch(fetchRoleData());
  } catch (error) {
    dispatch(setRoleError(error.message));
  }
};

// Selectors
export const selectRoleData = (state) => state.role.data;
export const selectRoleLoading = (state) => state.role.isLoading;
export const selectRoleError = (state) => state.role.error;
export const selectSelectedRole = (state) => state.role.selectedRole;

export default roleSlice.reducer;
