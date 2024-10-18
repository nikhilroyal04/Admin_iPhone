import React, { useEffect, useState } from "react";
import {
  Box,
  Text,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  useToast,
  SimpleGrid,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  fetchProductById,
  selectSelectedProduct,
  editProduct,
} from "../../app/features/productSlice";
import { AddIcon } from "@chakra-ui/icons";
import Loader from "../Not_Found/Loader";

const EditProduct = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const toast = useToast();
  const product = useSelector(selectSelectedProduct);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // State for form data
  const [formData, setFormData] = useState({
    model: "",
    type: "",
    color: [],
    storage: "",
    material: "",
    price: 0,
    originalPrice: 0,
    priceOff: 0,
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

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (product) {
      setFormData({
        model: product.model,
        type: product.type,
        color: product.color,
        storage: product.storage,
        material: product.material,
        price: product.price,
        originalPrice: product.originalPrice,
        priceOff: product.priceOff,
        quantity: product.quantity,
        batteryHealth: product.batteryHealth,
        releaseYear: product.releaseYear,
        features: product.features,
        compatibility: product.compatibility,
        condition: product.condition,
        warranty: product.warranty,
        addOn: product.addOn,
        purchaseDate: product.purchaseDate,
        age: product.age,
        repaired: product.repaired,
        categoryName: product.categoryName,
        status: product.status,
      });

      // Set existing media files when product data is fetched
      setMediaFiles(product.media.map((image) => ({ src: image, file: null })));
    }
  }, [product]);

  const handleEditProduct = async (e) => {
    e.preventDefault();
    const updatedFormData = new FormData();

    // Append form data to FormData object
    updatedFormData.append("model", formData.model);
    updatedFormData.append("type", formData.type);
    updatedFormData.append("color", formData.color); // Store as JSON
    updatedFormData.append("storage", formData.storage);
    updatedFormData.append("material", formData.material);
    updatedFormData.append("price", parseFloat(formData.price));
    updatedFormData.append("originalPrice", parseFloat(formData.originalPrice));
    updatedFormData.append("priceOff", parseFloat(formData.priceOff));
    updatedFormData.append("quantity", parseInt(formData.quantity, 10));
    updatedFormData.append("batteryHealth", parseFloat(formData.batteryHealth));
    updatedFormData.append("releaseYear", parseInt(formData.releaseYear, 10));
    updatedFormData.append("features", formData.features); // Store as JSON
    updatedFormData.append("compatibility", formData.compatibility); // Store as JSON
    updatedFormData.append("condition", formData.condition);
    updatedFormData.append("warranty", formData.warranty);
    updatedFormData.append("addOn", formData.addOn); // Store as JSON
    updatedFormData.append("purchaseDate", formData.purchaseDate);
    updatedFormData.append("age", parseInt(formData.age, 10));
    updatedFormData.append("repaired", formData.repaired); // Store as JSON
    updatedFormData.append("categoryName", formData.categoryName);
    updatedFormData.append("status", formData.status);

    // Append media files to FormData
    mediaFiles.forEach((media) => {
      if (media.file) {
        updatedFormData.append("media", media.file);
      }
    });

    setLoading(true);
    await dispatch(editProduct(product._id, updatedFormData));
    setLoading(false);

    toast({
      title: "Product Updated",
      description: "The product has been successfully updated.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    setIsEditing(false);
  };

  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length) {
      // Check the number of existing media files and the total limit
      if (mediaFiles.length + files.length <= 6) {
        const newMediaFiles = files.map((file) => ({
          src: URL.createObjectURL(file),
          file: file,
        }));

        // Update media files based on the number of selected files
        setMediaFiles((prev) => {
          // Replace existing images if the user selects less than current length
          if (prev.length >= 6) {
            // If trying to select more than 6, overwrite existing media
            return [
              ...prev.slice(0, prev.length - newMediaFiles.length), // Keep existing media
              ...newMediaFiles, // Add new images
            ];
          } else {
            // For adding new images
            return [...prev, ...newMediaFiles];
          }
        });
      } else {
        toast({
          title: "Image Limit Exceeded",
          description: "You can only upload up to 6 images.",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  const handleRemoveImage = (index) => {
    const updatedMediaFiles = mediaFiles.filter((_, i) => i !== index);
    setMediaFiles(updatedMediaFiles);
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (
      name === "color" ||
      name === "features" ||
      name === "compatibility" ||
      name === "addOn" ||
      name === "repaired"
    ) {
      // Convert comma-separated strings to arrays
      setFormData((prev) => ({
        ...prev,
        [name]: value.split(",").map((item) => item.trim()),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  if (!product) {
    return <Loader />;
  }

  return (
    <Box p={4}>
      {/* Image Preview Section */}
      <SimpleGrid columns={[2, 3, 6]} spacing={4} mb={6}>
        {mediaFiles.map((media, index) => (
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
            <img
              src={media.src}
              alt={`media-${index}`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
            {isEditing && ( // Hide remove button if not in edit mode
              <Button
                onClick={() => handleRemoveImage(index)}
                position="absolute"
                top={2}
                right={2}
                size="xs"
                colorScheme="red"
              >
                Remove
              </Button>
            )}
          </Box>
        ))}

        {mediaFiles.length < 6 &&
          isEditing && ( // Show add image box only if not in edit mode
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
              <AddIcon size="40px" color="#4A5568" /> {/* Add an icon */}
              <Text ml={2} fontSize="lg">
                Add Image
              </Text>
            </Box>
          )}
      </SimpleGrid>

      {/* Form Section */}
      <form onSubmit={handleEditProduct}>
        <SimpleGrid columns={[1, 2]} spacing={4}>
          <FormControl mb={4} isDisabled={!isEditing}>
            <FormLabel>Model</FormLabel>
            <Input name="model" defaultValue={product.model} required />
          </FormControl>
          <FormControl mb={4} isDisabled={!isEditing}>
            <FormLabel>Type</FormLabel>
            <Select name="type" defaultValue={product.type} required>
              <option value="charger">Charger</option>
              <option value="case">Case</option>
              <option value="earbuds">Earbuds</option>
              <option value="screen protector">Screen Protector</option>
              <option value="android">Android</option>
              <option value="iphone">iPhone</option>
              <option value="other">Other</option>
            </Select>
          </FormControl>
          <FormControl mb={4} isDisabled={!isEditing}>
            <FormLabel>Color</FormLabel>
            <Input
              name="color"
              defaultValue={product.color.join(", ")} // Accepts multiple colors as a comma-separated string
              placeholder="Enter colors separated by commas"
            />
          </FormControl>
          <FormControl mb={4} isDisabled={!isEditing}>
            <FormLabel>Storage</FormLabel>
            <Input name="storage" defaultValue={product.storage} />
          </FormControl>
          <FormControl mb={4} isDisabled={!isEditing}>
            <FormLabel>Material</FormLabel>
            <Input name="material" defaultValue={product.material} />
          </FormControl>
          <FormControl mb={4} isDisabled={!isEditing}>
            <FormLabel>Price</FormLabel>
            <Input
              type="number"
              name="price"
              defaultValue={product.price}
              required
            />
          </FormControl>
          <FormControl mb={4} isDisabled={!isEditing}>
            <FormLabel>Original Price</FormLabel>
            <Input
              type="number"
              name="originalPrice"
              defaultValue={product.originalPrice}
            />
          </FormControl>
          <FormControl mb={4} isDisabled={!isEditing}>
            <FormLabel>Price Off</FormLabel>
            <Input
              type="number"
              name="priceOff"
              defaultValue={product.priceOff}
            />
          </FormControl>
          <FormControl mb={4} isDisabled={!isEditing}>
            <FormLabel>Quantity</FormLabel>
            <Input
              type="number"
              name="quantity"
              defaultValue={product.quantity}
              min="0"
              required
            />
          </FormControl>
          <FormControl mb={4} isDisabled={!isEditing}>
            <FormLabel>Battery Health</FormLabel>
            <Input
              type="number"
              name="batteryHealth"
              defaultValue={product.batteryHealth}
              min="0"
              max="100"
            />
          </FormControl>
          <FormControl mb={4} isDisabled={!isEditing}>
            <FormLabel>Release Year</FormLabel>
            <Input
              type="number"
              name="releaseYear"
              defaultValue={product.releaseYear}
              min="1900"
              max={new Date().getFullYear()}
            />
          </FormControl>
          <FormControl mb={4} isDisabled={!isEditing}>
            <FormLabel>Compatibility</FormLabel>
            <Input
              name="compatibility"
              defaultValue={product.compatibility.join(", ")} // Accepts multiple compatibility options as a comma-separated string
              placeholder="Enter compatibility options separated by commas"
            />
          </FormControl>
          <FormControl mb={4} isDisabled={!isEditing}>
            <FormLabel>Condition</FormLabel>
            <Input name="condition" defaultValue={product.condition} />
          </FormControl>
          <FormControl mb={4} isDisabled={!isEditing}>
            <FormLabel>Warranty</FormLabel>
            <Input name="warranty" defaultValue={product.warranty} />
          </FormControl>
          <FormControl mb={4} isDisabled={!isEditing}>
            <FormLabel>Add On</FormLabel>
            <Input
              name="addOn"
              defaultValue={product.addOn.join(", ")} // Accepts multiple add-ons as a comma-separated string
              placeholder="Enter add-ons separated by commas"
            />
          </FormControl>
          <FormControl mb={4} isDisabled={!isEditing}>
            <FormLabel>Purchase Date</FormLabel>
            <Input
              type="date"
              name="purchaseDate"
              defaultValue={product.purchaseDate}
            />
          </FormControl>
          <FormControl mb={4} isDisabled={!isEditing}>
            <FormLabel>Age</FormLabel>
            <Input
              type="number"
              name="age"
              defaultValue={product.age}
              min="0"
            />
          </FormControl>
          <FormControl mb={4} isDisabled={!isEditing}>
            <FormLabel>Repaired</FormLabel>
            <Input
              name="repaired"
              defaultValue={product.repaired.join(", ")} // Accepts multiple repairs as a comma-separated string
              placeholder="Enter repaired items separated by commas"
            />
          </FormControl>
          <FormControl mb={4} isDisabled={!isEditing}>
            <FormLabel>Category Name</FormLabel>
            <Input name="categoryName" defaultValue={product.categoryName} />
          </FormControl>
          <FormControl mb={4} isDisabled={!isEditing}>
            <FormLabel>Status</FormLabel>
            <Input name="status" defaultValue={product.status} />
          </FormControl>
        </SimpleGrid>

        {!isEditing ? (
          <Button colorScheme="blue" onClick={handleEditToggle}>
            Edit
          </Button>
        ) : (
          <Box display="flex" mt={4}>
            <Button colorScheme="red" onClick={handleEditToggle} mr={2}>
              Cancel
            </Button>
            <Button colorScheme="blue" type="submit" isLoading={loading}>
              Update
            </Button>
          </Box>
        )}
      </form>
    </Box>
  );
};

export default EditProduct;
