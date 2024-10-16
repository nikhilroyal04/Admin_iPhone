import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  SimpleGrid,
  Textarea,
  useToast,
  Heading,
  Grid,
  GridItem,
  Image,
  Flex,
  Text,
} from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { addProduct } from "../../app/features/productSlice"; // Ensure this action exists
import { AddIcon } from "@chakra-ui/icons";
import TimeConversion from "../../utils/timeConversion";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  // State for form data
  const [formData, setFormData] = useState({
    model: "",
    type: "",
    color: [],
    storage: "",
    material: "",
    price: 0,
    originalPrice: 0,
    quantity: 0,
    batteryHealth: 0,
    releaseYear: 0,
    features: [],
    compatibility: [],
    condition: "",
    warranty: "",
    addOn: [],
    purchaseDate: "",
    age: 0,
    repaired: [],
    categoryName: "",
    status: "available",
  });

  const [mediaFiles, setMediaFiles] = useState([]); // State for storing media files
  const [previewImages, setPreviewImages] = useState([]); // State for image previews

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    const fd = new FormData();

    const purchaseDateUnix = TimeConversion.realTimeToUnixTime(
      formData.purchaseDate
    );
    const updatedFormData = { ...formData, purchaseDate: purchaseDateUnix };

    // Append formData values to FormData
    Object.keys(updatedFormData).forEach((key) => {
      fd.append(key, updatedFormData[key]);
    });

    // Append media files to FormData
    mediaFiles.forEach((media) => {
      fd.append("media", media.file);
    });

    // Dispatch the action to add the product
    dispatch(addProduct(fd)); // Dispatch with formData
    toast({
      title: "Product Added",
      description: "The product has been successfully added.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    navigate("/products");

    // Clear form and media files after submission
    e.target.reset();
    setMediaFiles([]);
    setPreviewImages([]);
    setFormData({
      model: "",
      type: "",
      color: "",
      storage: "",
      material: "",
      price: 0,
      originalPrice: 0,
      quantity: 0,
      batteryHealth: 0,
      releaseYear: 0,
      features: "",
      compatibility: "",
      condition: "",
      warranty: "",
      addOn: "",
      purchaseDate: "",
      age: 0,
      repaired: "",
      categoryName: "",
      status: "",
    }); // Reset form data
  };

  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files); // Get all selected files
    const newMediaFiles = files.map((file) => ({
      src: URL.createObjectURL(file),
      file: file,
    }));

    setMediaFiles((prevFiles) => [...prevFiles, ...newMediaFiles]);
    setPreviewImages((prevImages) => [
      ...prevImages,
      ...newMediaFiles.map((media) => media.src),
    ]); // Append new previews to existing
  };

  return (
    <Box p={4} bg="white" borderRadius="md" boxShadow="md">
      <Heading as="h2" size="lg" mb={6} textAlign="center">
        Add New Product
      </Heading>

      {/* Media Upload Section */}
      <SimpleGrid columns={[2, 3, 6]} spacing={4} mb={6}>
        {previewImages.map((src, index) => (
          <Box
            key={index}
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            boxShadow="lg"
            p={2}
            textAlign="center"
            display="flex"
            alignItems="center"
            justifyContent="center"
            height="150px"
            position="relative"
          >
            <Image
              src={src}
              alt={`media-${index}`}
              objectFit="cover"
              boxSize="100%"
            />
            <Button
              onClick={() => {
                const updatedFiles = mediaFiles.filter((_, i) => i !== index);
                const updatedPreviews = previewImages.filter(
                  (_, i) => i !== index
                );
                setMediaFiles(updatedFiles);
                setPreviewImages(updatedPreviews);
              }}
              position="absolute"
              top={2}
              right={2}
              size="xs"
              colorScheme="red"
            >
              Remove
            </Button>
          </Box>
        ))}

        {/* File input for adding images */}
        {previewImages.length < 6 && (
          <Box
            onClick={() => document.getElementById("file-input").click()} // Trigger file input click
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            boxShadow="lg"
            p={4}
            display="flex"
            alignItems="center"
            justifyContent="center"
            cursor="pointer"
            height="150px"
            textAlign="center"
            position="relative"
          >
            <input
              id="file-input" // Hidden input
              type="file"
              accept="image/*"
              onChange={handleMediaChange}
              multiple
              style={{ display: "none" }} // Hide the actual input
            />
            <AddIcon size="40px" color="#4A5568" />
            <Text ml={2} fontSize="lg">
              Add Image
            </Text>
          </Box>
        )}
      </SimpleGrid>

      <form onSubmit={handleAddProduct}>
        <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4}>
          <GridItem>
            <FormControl mb={4}>
              <FormLabel>Model</FormLabel>
              <Input
                name="model"
                value={formData.model}
                onChange={handleInputChange}
                required
              />
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl mb={4}>
              <FormLabel>Type</FormLabel>
              <Select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                required
              >
                <option value="charger">Charger</option>
                <option value="case">Case</option>
                <option value="earbuds">Earbuds</option>
                <option value="screen protector">Screen Protector</option>
                <option value="android">Android</option>
                <option value="iphone">iPhone</option>
                <option value="other">Other</option>
              </Select>
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl mb={4}>
              <FormLabel>Color</FormLabel>
              <Input
                name="color"
                value={formData.color}
                onChange={handleInputChange}
                placeholder="Comma separated values"
              />
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl mb={4}>
              <FormLabel>Storage</FormLabel>
              <Input
                name="storage"
                value={formData.storage}
                onChange={handleInputChange}
                required
              />
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl mb={4}>
              <FormLabel>Material</FormLabel>
              <Input
                name="material"
                value={formData.material}
                onChange={handleInputChange}
              />
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl mb={4}>
              <FormLabel>Price</FormLabel>
              <Input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
              />
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl mb={4}>
              <FormLabel>Original Price</FormLabel>
              <Input
                type="number"
                name="originalPrice"
                value={formData.originalPrice}
                onChange={handleInputChange}
              />
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl mb={4}>
              <FormLabel>Quantity</FormLabel>
              <Input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                required
                min="0"
              />
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl mb={4}>
              <FormLabel>Battery Health (%)</FormLabel>
              <Input
                type="number"
                name="batteryHealth"
                value={formData.batteryHealth}
                onChange={handleInputChange}
              />
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl mb={4}>
              <FormLabel>Release Year</FormLabel>
              <Input
                type="number"
                name="releaseYear"
                value={formData.releaseYear}
                onChange={handleInputChange}
                required
              />
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl mb={4}>
              <FormLabel>Features</FormLabel>
              <Input
                name="features"
                value={formData.features}
                onChange={handleInputChange}
                placeholder="Comma separated values"
              />
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl mb={4}>
              <FormLabel>Compatibility</FormLabel>
              <Input
                name="compatibility"
                value={formData.compatibility}
                onChange={handleInputChange}
                placeholder="Comma separated values"
              />
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl mb={4}>
              <FormLabel>Condition</FormLabel>
              <Select
                name="condition"
                value={formData.condition}
                onChange={handleInputChange}
                required
              >
                <option value="new">New</option>
                <option value="like new">Like New</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="poor">Poor</option>
              </Select>
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl mb={4}>
              <FormLabel>Warranty</FormLabel>
              <Input
                name="warranty"
                value={formData.warranty}
                onChange={handleInputChange}
                placeholder="e.g. 1 year"
              />
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl mb={4}>
              <FormLabel>Add-ons</FormLabel>
              <Input
                name="addOn"
                value={formData.addOn}
                onChange={handleInputChange}
                placeholder="Comma separated values"
              />
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl mb={4}>
              <FormLabel>Purchase Date</FormLabel>
              <Input
                name="purchaseDate"
                type="date"
                value={formData.purchaseDate}
                onChange={handleInputChange}
              />
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl mb={4}>
              <FormLabel>Age</FormLabel>
              <Input
                name="age"
                type="number"
                value={formData.age}
                onChange={handleInputChange}
              />
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl mb={4}>
              <FormLabel>Repaired</FormLabel>
              <Input
                name="repaired"
                value={formData.repaired}
                onChange={handleInputChange}
                placeholder="Comma separated values"
              />
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl mb={4}>
              <FormLabel>Category Name</FormLabel>
              <Input
                name="categoryName"
                value={formData.categoryName}
                onChange={handleInputChange}
                required
              />
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl mb={4}>
              <FormLabel>Status</FormLabel>
              <Select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                required
              >
                <option value="available">Available</option>
                <option value="soldout">Sold Out</option>
                <option value="inactive">Inactive</option>
              </Select>
            </FormControl>
          </GridItem>
        </Grid>

        <Button colorScheme="blue" type="submit" rightIcon={<AddIcon />}>
          Add Product
        </Button>
      </form>
    </Box>
  );
};

export default AddProduct;
