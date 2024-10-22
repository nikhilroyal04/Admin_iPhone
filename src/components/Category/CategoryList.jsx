import React, { useEffect, useState } from "react";
import {
  Box,
  SimpleGrid,
  Image,
  Text,
  Heading,
  Badge,
  Spinner,
  Alert,
  AlertIcon,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Flex,
  Select,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCategoryData,
  selectCategoryData,
  selectCategoryError,
  selectCategoryLoading,
  removeCategory,
} from "../../app/features/categorySlice";
import AddCategory from "./AddCategory";
import EditCategory from "./EditCategory";
import Loader from "../Not_Found/Loader";
import Error502 from "../Not_Found/Error502";

export default function CategoryList() {
  const dispatch = useDispatch();
  const {
    isOpen: isAddOpen,
    onOpen: onAddOpen,
    onClose: onAddClose,
  } = useDisclosure();
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure(); // New state for delete confirmation
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null); // State for selected category for editing
  const [filterStatus, setFilterStatus] = useState(""); // State for filtering categories by status

  // Selectors to get category data, loading state, and error state from the Redux store
  const categories = useSelector(selectCategoryData);
  const isLoading = useSelector(selectCategoryLoading);
  const error = useSelector(selectCategoryError);

  // Fetch category data when the component mounts
  useEffect(() => {
    dispatch(fetchCategoryData());
  }, [dispatch]);

  // Render loading spinner while data is being fetched
  if (isLoading) {
    return <Loader />;
  }

  // Render error message if there is an error
  if (error) {
    return <Error502 />;
  }

  // Filter categories based on selected status
  const filteredCategories = filterStatus
    ? categories.filter((category) => category.status === filterStatus)
    : categories;

  // Function to handle delete confirmation
  const handleDelete = () => {
    if (categoryToDelete) {
      dispatch(removeCategory(categoryToDelete));
      setCategoryToDelete(null);
      onDeleteClose(); // Close the delete confirmation modal
    }
  };

  return (
    <Box p={4}>
      {/* Header with Title and Add Category Button */}

      <Flex justify="space-between" align="center" mb={4}>
        <Grid
          templateColumns={{ base: "1fr", md: "1fr 2fr"}} // Two columns for md and above
          gap={4}
          width="100%"
        >
          {/* Category List Heading */}
          <GridItem>
            <Text fontSize="2xl">Category List</Text>
          </GridItem>

          {/* Flex container for Filter and Add Category Button */}
          <GridItem>
            <Flex
              direction={{ base: "column", sm: "row" }} 
              justifyContent="flex-end" 
              gap={2}
            >
              <Select
                placeholder="Filter by status"
                onChange={(e) => setFilterStatus(e.target.value)}
                width={{ base: "100%", md: "auto" }} 
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </Select>
              <Button
                onClick={onAddOpen}
                colorScheme="green"
                width={{ base: "100%", md: "auto" }}
              >
                Add Category
              </Button>
            </Flex>
          </GridItem>
        </Grid>
      </Flex>

      <SimpleGrid columns={[1, 2, 2, 2, 3]} spacing={4}>
      {filteredCategories.map((category) => (
          <Box
            key={category.id}
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            boxShadow="lg"
            p={4}
            textAlign="center"
          >
            <Box height="400px" overflow="hidden">
              <Image
                src={category.categoryImage}
                alt={category.name}
                objectFit="cover"
                height="100%"
                width="100%"
              />
            </Box>
            <Text fontWeight="bold" mt={2}>
              {category.name}
            </Text>
            <Text fontSize="sm" color="gray.600" mb={2}>
              {category.description}
            </Text>
            <Text fontSize="sm" color="gray.600" mb={2}>
              Status:{" "}
              <Badge
                colorScheme={category.status === "Active" ? "green" : "red"}
              >
                {category.status}
              </Badge>
            </Text>
            <Box mt={4}>
              <Button
                colorScheme="blue"
                size="sm"
                mr={2}
                onClick={() => {
                  setSelectedCategory(category); // Set selected category for editing
                  onEditOpen(); // Open edit modal
                }}
              >
                Edit
              </Button>
              <Button
                colorScheme="red"
                size="sm"
                onClick={() => {
                  setCategoryToDelete(category._id);
                  onDeleteOpen(); // Open delete confirmation modal
                }}
              >
                Delete
              </Button>
            </Box>
          </Box>
        ))}
      </SimpleGrid>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
        {" "}
        {/* Use isDeleteOpen instead of isOpen */}
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Deletion</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Are you sure you want to delete this category?</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={onDeleteClose}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={handleDelete} ml={3}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Add Category Modal */}
      <Modal isOpen={isAddOpen} onClose={onAddClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Category</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <AddCategory onClose={onAddClose} />
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Edit Category Modal */}
      <Modal isOpen={isEditOpen} onClose={onEditClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Category</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <EditCategory category={selectedCategory} onClose={onEditClose} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}
