import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { editUser } from "../../app/features/userSlice";
import { fetchRoleData, selectRoleData } from "../../app/features/roleSlice";

export default function EditUser({ isOpen, onClose, user }) {
  const dispatch = useDispatch();
  const roleData = useSelector(selectRoleData);

  // Initialize formData state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "",
    status: "",
    reason: "",
  });

  // Loading state
  const [loading, setLoading] = useState(false);

  // Fetch role data on initial render
  useEffect(() => {
    dispatch(fetchRoleData());
  }, [dispatch]);

  // Update formData when the user prop changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        password: user.password || "",
        role: user.role || "User",
        status: user.status || "Active",
        reason: user.status === "Inactive" ? user.reason || "" : "",
      });
    }
  }, [user]);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Ensure mandatory fields are filled
    if (
      formData.name.trim() === "" ||
      formData.email.trim() === "" ||
      formData.phoneNumber.trim() === "" ||
      (formData.status === "Inactive" && formData.reason.trim() === "")
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    // Prepare updatedUser object
    const updatedUser = {
      ...formData,
      updatedOn: Date.now(),
    };

    setLoading(true); // Start loading

    try {
      // Dispatching the action
      await dispatch(editUser(user._id, updatedUser));
    } catch (error) {
      alert("Error updating user: " + error.message);
    } finally {
      setLoading(false); // Stop loading
      onClose(); // Close modal after submitting
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit User</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {/* Name Field */}
          <FormControl mb={4} isRequired>
            <FormLabel>Name</FormLabel>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter name"
            />
          </FormControl>

          {/* Email Field */}
          <FormControl mb={4} isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
            />
          </FormControl>

          {/* Phone Number Field */}
          <FormControl mb={4} isRequired>
            <FormLabel>Phone</FormLabel>
            <Input
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Enter phone number"
            />
          </FormControl>

          {/* Password Field */}
          <FormControl mb={4} isRequired>
            <FormLabel>Password</FormLabel>
            <Input
              name="password"
              type="text" // Change to text for pre-filling
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
            />
          </FormControl>

          {/* Status Field */}
          <FormControl mb={4} isRequired>
            <FormLabel>Status</FormLabel>
            <Select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </Select>
          </FormControl>

          {/* Reason for Inactive Status Field (Visible only if status is "Inactive") */}
          {formData.status === "Inactive" && (
            <FormControl mb={4} isRequired>
              <FormLabel>Reason for Inactive Status</FormLabel>
              <Input
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                placeholder="Enter reason for inactive status"
              />
            </FormControl>
          )}

          {/* Role Field */}
          <FormControl isRequired>
            <FormLabel>Role</FormLabel>
            <Select
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              {roleData.map((role) => (
                <option key={role._id} value={role.roleName}>
                  {role.roleName}
                </option>
              ))}
            </Select>
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="blue"
            mr={3}
            onClick={handleSubmit}
            isLoading={loading}
          >
            Save
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
