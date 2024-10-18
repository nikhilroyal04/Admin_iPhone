import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Text,
  Input,
  Button,
  FormControl,
  FormLabel,
  Select,
  VStack,
  HStack,
  Stack,
  IconButton,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import {
  selectSelectedFeature,
  selectFeatureError,
  selectFeatureLoading,
  fetchFeatureById,
  editFeature,
} from "../../app/features/featureSlice";
import Loader from "../Not_Found/Loader";
import Error502 from "../Not_Found/Error502";

export default function EditFeature() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const featureData = useSelector(selectSelectedFeature);
  const error = useSelector(selectFeatureError);
  const isLoading = useSelector(selectFeatureLoading);

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    status: "",
    description: [],
  });

  useEffect(() => {
    dispatch(fetchFeatureById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (featureData) {
      setFormData({
        name: featureData.name || "",
        status: featureData.status || "Active",
        description: featureData.description || [],
      });
    }
  }, [featureData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDescriptionChange = (index, value) => {
    const updatedDescription = formData.description.map((desc, idx) =>
      idx === index ? { ...desc, category: value } : desc
    );
    setFormData((prevData) => ({
      ...prevData,
      description: updatedDescription,
    }));
  };

  const handleFeatureChange = (descIndex, featureIndex, value) => {
    const updatedDescription = formData.description.map((desc, idx) => {
      if (idx === descIndex) {
        const updatedFeatures = [...desc.features];
        updatedFeatures[featureIndex] = value;
        return { ...desc, features: updatedFeatures };
      }
      return desc;
    });
    setFormData((prevData) => ({
      ...prevData,
      description: updatedDescription,
    }));
  };

  const handleAddFeature = (index) => {
    const updatedDescription = [...formData.description];
    updatedDescription[index] = {
      ...updatedDescription[index],
      features: [...updatedDescription[index].features, ""],
    };
    setFormData((prevData) => ({
      ...prevData,
      description: updatedDescription,
    }));
  };

  const handleAddCategory = () => {
    const newCategory = { category: "", features: [""] };
    setFormData((prevData) => ({
      ...prevData,
      description: [...prevData.description, newCategory],
    }));
  };

  // Function to delete a category
  const handleDeleteCategory = (index) => {
    const updatedDescription = formData.description.filter(
      (_, idx) => idx !== index
    );
    setFormData((prevData) => ({
      ...prevData,
      description: updatedDescription,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await dispatch(editFeature(id, formData));
      setLoading(false);
      navigate("/features");
    } catch (err) {
      setLoading(false);
      console.error("Error updating feature:", err);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <Error502 />;
  }

  return (
    <Box p={4}>
      <VStack spacing={6} align="start">
        <FormControl id="name" isRequired>
          <FormLabel>Feature Name</FormLabel>
          <Input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter feature name"
          />
        </FormControl>

        <FormControl id="status" isRequired>
          <FormLabel>Status</FormLabel>
          <Select
            name="status"
            value={formData.status}
            onChange={handleChange}
            placeholder="Select status"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </Select>
        </FormControl>

        <FormControl id="description" isRequired>
          <FormLabel>Feature Description</FormLabel>
          {formData.description.map((desc, index) => (
            <Box key={index} mb={4}>
              <HStack justifyContent="space-between">
                <FormLabel>Category Name</FormLabel>
                <IconButton
                  aria-label="Delete category"
                  icon={<DeleteIcon fontSize="md" color="red" />}
                  onClick={() => handleDeleteCategory(index)}
                  variant="ghost"
                  mb={2}
                />
              </HStack>
              <Input
                value={desc.category}
                onChange={(e) => handleDescriptionChange(index, e.target.value)}
                placeholder="Enter category name"
              />
              <Text fontWeight="bold" fontSize="lg" mt={2}>
                Features:
              </Text>
              <Stack spacing={1}>
                {desc.features.map((feature, featureIndex) => (
                  <HStack key={featureIndex}>
                    <Input
                      value={feature}
                      onChange={(e) =>
                        handleFeatureChange(index, featureIndex, e.target.value)
                      }
                      placeholder={`Feature ${featureIndex + 1}`}
                    />
                  </HStack>
                ))}
              </Stack>

              <Button
                mt={2}
                onClick={() => handleAddFeature(index)}
                colorScheme="blue"
                size="sm"
              >
                Add Feature
              </Button>
            </Box>
          ))}

          <Button mt={4} onClick={handleAddCategory} colorScheme="green">
            Add Category
          </Button>
        </FormControl>

        <HStack justifyContent="flex-end" w="100%">
          <Button
            colorScheme="blue"
            isLoading={loading}
            loadingText="Saving"
            onClick={handleSubmit}
          >
            Save Changes
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
}
