import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  SimpleGrid,
  Select,
  useToast,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserData,
  selectUserData,
  selectUserError,
  selectUserLoading,
} from "../../app/features/userSlice";
import { addAddress } from "../../app/features/addressSlice";
import Loader from "../Not_Found/Loader";
import Error502 from "../Not_Found/Error502";

const statesEnum = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Lakshadweep",
  "Delhi",
  "Puducherry",
];

const AddAddress = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    userId: "", // Optional: You can pre-fill this if needed.
    name: "",
    phoneNumber: "",
    email: "",
    addressLine1: "",
    locality: "",
    landmark: "",
    pincode: "",
    city: "",
    state: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const toast = useToast();

  // User Data, Error and loading states
  const userData = useSelector(selectUserData);
  const userError = useSelector(selectUserError);
  const userLoading = useSelector(selectUserLoading);

  // Fetch user data when the component mounts
  useEffect(() => {
    dispatch(fetchUserData());
  }, [dispatch]);

  // Validate form fields
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.phoneNumber || !/^\d{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Enter a valid 10-digit phone number";
    }
    if (
      !formData.email ||
      !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)
    ) {
      newErrors.email = "Enter a valid email address";
    }
    if (!formData.addressLine1)
      newErrors.addressLine1 = "Address Line 1 is required";
    if (!formData.locality) newErrors.locality = "Locality is required";
    if (!formData.pincode || !/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = "Pincode must be 6 digits";
    }
    if (!formData.city) newErrors.city = "City is required";
    if (!formData.state) newErrors.state = "State is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  // Handle form change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submit
  const handleSubmit = async () => {
    if (validateForm()) {
      setLoading(true);
      try {
        await dispatch(addAddress(formData));
        toast({
          title: "New Address added.",
          description: "Your address has been added successfully.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        onClose();
      } catch (error) {
        toast({
          title: "Error adding address.",
          description: "There was an error while adding the address.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        console.error("Failed to save the address", error);
      } finally {
        setLoading(false);
      }
    }
  };

  if (userLoading) {
    return <Loader />;
  }

  // Render error message if there is an error
  if (userError) {
    return <Error502 />;
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent maxW={{ base: "90%", md: "800px" }}>
        <ModalHeader>Add Address</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <SimpleGrid columns={[1, null, 2]} spacing={4}>
            {/* UserId Field (Optional) */}
            <FormControl>
              <FormLabel>Select User</FormLabel>
              <Select
                name="userId"
                value={formData.userId}
                onChange={handleChange}
                placeholder="Select a user"
              >
                {userData &&
                  userData.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.name}
                    </option>
                  ))}
              </Select>
            </FormControl>

            {/* Name Field */}
            <FormControl isRequired isInvalid={errors.name}>
              <FormLabel>Name</FormLabel>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
              <FormErrorMessage>{errors.name}</FormErrorMessage>
            </FormControl>

            {/* Phone Number Field */}
            <FormControl isRequired isInvalid={errors.phoneNumber}>
              <FormLabel>Phone Number</FormLabel>
              <Input
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                type="tel"
              />
              <FormErrorMessage>{errors.phoneNumber}</FormErrorMessage>
            </FormControl>

            {/* Email Field */}
            <FormControl isRequired isInvalid={errors.email}>
              <FormLabel>Email</FormLabel>
              <Input
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
              />
              <FormErrorMessage>{errors.email}</FormErrorMessage>
            </FormControl>

            {/* Address Line 1 */}
            <FormControl isRequired isInvalid={errors.addressLine1}>
              <FormLabel>Address Line 1</FormLabel>
              <Input
                name="addressLine1"
                value={formData.addressLine1}
                onChange={handleChange}
              />
              <FormErrorMessage>{errors.addressLine1}</FormErrorMessage>
            </FormControl>

            {/* Locality */}
            <FormControl isRequired isInvalid={errors.locality}>
              <FormLabel>Locality</FormLabel>
              <Input
                name="locality"
                value={formData.locality}
                onChange={handleChange}
              />
              <FormErrorMessage>{errors.locality}</FormErrorMessage>
            </FormControl>

            {/* Landmark */}
            <FormControl>
              <FormLabel>Landmark</FormLabel>
              <Input
                name="landmark"
                value={formData.landmark}
                onChange={handleChange}
              />
            </FormControl>

            {/* Pincode */}
            <FormControl isRequired isInvalid={errors.pincode}>
              <FormLabel>Pincode</FormLabel>
              <Input
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                maxLength={6}
                type="number"
              />
              <FormErrorMessage>{errors.pincode}</FormErrorMessage>
            </FormControl>

            {/* City */}
            <FormControl isRequired isInvalid={errors.city}>
              <FormLabel>City</FormLabel>
              <Input
                name="city"
                value={formData.city}
                onChange={handleChange}
              />
              <FormErrorMessage>{errors.city}</FormErrorMessage>
            </FormControl>

            {/* State - Select Dropdown */}
            <FormControl isRequired isInvalid={errors.state}>
              <FormLabel>State</FormLabel>
              <Select
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="Select State"
              >
                {statesEnum.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </Select>
              <FormErrorMessage>{errors.state}</FormErrorMessage>
            </FormControl>
          </SimpleGrid>
        </ModalBody>

        <ModalFooter>
          <Button onClick={onClose} mr={3}>
            Cancel
          </Button>
          <Button colorScheme="blue" onClick={handleSubmit} isLoading={loading}>
            Add Address
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddAddress;
