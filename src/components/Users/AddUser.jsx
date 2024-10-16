import React, { useEffect, useState } from "react";
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
  Spinner,
  Text,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../../app/features/userSlice";
import { fetchRoleData, selectRoleData } from "../../app/features/roleSlice";

export default function AddUser({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const roles = useSelector(selectRoleData);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "User",
    status: "Active",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ email: "", phone: "" });

  useEffect(() => {
    dispatch(fetchRoleData()); // Fetch roles when component mounts
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "email") {
      setErrors((prevErrors) => ({ ...prevErrors, email: "" }));
    } else if (name === "phoneNumber") {
      setErrors((prevErrors) => ({ ...prevErrors, phone: "" }));
    }
  };

  const validateFields = () => {
    let emailError = "";
    let phoneError = "";

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!formData.email.trim()) {
      emailError = "Email is required.";
    } else if (!emailPattern.test(formData.email)) {
      emailError = "Invalid email format.";
    }

    const phonePattern = /^[0-9]{10}$/;
    if (!formData.phoneNumber.trim()) {
      phoneError = "Phone number is required.";
    } else if (!phonePattern.test(formData.phoneNumber)) {
      phoneError = "Phone number must be 10 digits.";
    }

    setErrors({ email: emailError, phone: phoneError });

    return !emailError && !phoneError;
  };

  const handleSubmit = async () => {
    const isValid = validateFields();
    if (!isValid) return;

    setLoading(true);

    try {
      await dispatch(addUser(formData));
      onClose();
    } catch (err) {
      alert("Error adding user: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add New User</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl mb={4} isRequired>
            <FormLabel>Name</FormLabel>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter name"
            />
          </FormControl>
          <FormControl mb={4} isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
            />
            {errors.email && <Text color="red.500">{errors.email}</Text>}
          </FormControl>
          <FormControl mb={4} isRequired>
            <FormLabel>Phone</FormLabel>
            <Input
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Enter phone number (10 digits)"
            />
            {errors.phone && <Text color="red.500">{errors.phone}</Text>}
          </FormControl>
          <FormControl mb={4} isRequired>
            <FormLabel>Password</FormLabel>
            <Input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
            />
          </FormControl>
          <FormControl mb={4}>
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
          <FormControl>
            <FormLabel>Role</FormLabel>
            <Select name="role" value={formData.role} onChange={handleChange}>
              {roles.map((role) => (
                <option key={role._id} value={role.roleName}>
                  {role.roleName}
                </option>
              ))}
            </Select>
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="green"
            mr={3}
            onClick={handleSubmit}
            isLoading={loading}
            loadingText="Adding..."
          >
            {loading ? <Spinner size="sm" /> : "Add User"}
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
