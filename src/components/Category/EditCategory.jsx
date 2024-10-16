// src/components/EditCategory.js
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  Heading,
  useToast,
  Icon,
  Flex,
} from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { editCategory } from "../../app/features/categorySlice"; // Assuming you have this action
import { AddIcon, CloseIcon } from "@chakra-ui/icons"; // Importing icons

export default function EditCategory({ category, onClose }) {
  const dispatch = useDispatch();
  const toast = useToast();
  const [categoryData, setCategoryData] = useState(category);
  const [imagePreview, setImagePreview] = useState(null); // State for image preview
  const [loading, setLoading] = useState(false); // State for loading

  useEffect(() => {
    setCategoryData(category);
    setImagePreview(category.categoryImage ? category.categoryImage : null); // Set initial image preview
  }, [category]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategoryData({ ...categoryData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCategoryData({ ...categoryData, categoryImage: file });
      setImagePreview(URL.createObjectURL(file)); // Set the image preview
    }
  };

  const handleImageRemove = (e) => {
    e.stopPropagation(); // Prevent the click from bubbling up to the card
    setCategoryData({ ...categoryData, categoryImage: null });
    setImagePreview(null); // Remove the image preview
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading state to true

    // Create a FormData object to submit
    const formData = new FormData();
    formData.append("name", categoryData.name);
    formData.append("description", categoryData.description);
    formData.append("status", categoryData.status);

    // Append the image file if it exists
    if (categoryData.categoryImage) {
      formData.append("categoryImage", categoryData.categoryImage);
    }

    try {
      await dispatch(editCategory(categoryData._id, formData));
      toast({
        title: "Category updated.",
        description: `${categoryData.name} has been updated.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onClose(); // Close the modal after submission
    } catch (error) {
      toast({
        title: "Error updating category.",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false); // Reset loading state after the operation
    }
  };

  return (
    <Box p={4}>
      <Heading as="h3" size="lg" mb={4}>
        Edit Category
      </Heading>
      <form onSubmit={handleSubmit}>
        {/* Image Upload Card */}
        <Box
          p={4}
          borderWidth={1}
          borderRadius="md"
          textAlign="center"
          cursor="pointer"
          onClick={() => document.getElementById("image-input").click()} // Trigger file input on click
          mb={4}
          position="relative" // To position the close icon
          height="180px" // Set a fixed height for the card
        >
          {imagePreview ? (
            // Render the image preview if it exists
            <img
              src={imagePreview}
              alt="Preview"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "md", // Match the card's border radius
              }}
            />
          ) : (
            // Render the plus icon if no image is selected
            <Flex
              direction="column"
              align="center"
              justify="center"
              height="100%" // Full height of the card
            >
              <Icon as={AddIcon} boxSize={8} />
              <p>Click to upload an image</p>
            </Flex>
          )}
          <Input
            id="image-input"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            display="none" // Hide the file input
          />
          {imagePreview && (
            // Render the close icon when an image is selected
            <Box
              position="absolute"
              top={2}
              right={2}
              cursor="pointer"
              onClick={handleImageRemove}
              zIndex={1}
            >
              <Icon as={CloseIcon} boxSize={6} color="red.500" />
            </Box>
          )}
        </Box>

        <FormControl isRequired>
          <FormLabel>Name</FormLabel>
          <Input
            name="name"
            value={categoryData.name}
            onChange={handleChange}
          />
        </FormControl>
        <FormControl isRequired mt={4}>
          <FormLabel>Description</FormLabel>
          <Textarea
            name="description"
            value={categoryData.description}
            onChange={handleChange}
          />
        </FormControl>
        <FormControl isRequired mt={4}>
          <FormLabel>Status</FormLabel>
          <Select
            name="status"
            value={categoryData.status}
            onChange={handleChange}
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </Select>
        </FormControl>
        <Flex justify="center" mt={6} mb={4}>
          {" "}
          {/* Centering the button */}
          <Button colorScheme="teal" type="submit" isLoading={loading}>
            Update Category
          </Button>
        </Flex>
      </form>
    </Box>
  );
}
