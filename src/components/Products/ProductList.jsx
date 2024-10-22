import React, { useEffect, useState } from "react";
import {
  Box,
  Text,
  Spinner,
  Alert,
  AlertIcon,
  SimpleGrid,
  Image,
  Badge,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  HStack,
  Flex,
  Input,
  Select,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProductData,
  selectProductData,
  selectProductError,
  selectProductLoading,
  selectTotalPages,
  deleteProduct,
} from "../../app/features/productSlice";
import {
  selectCategoryData,
  selectCategoryError,
  selectCategoryLoading,
  fetchCategoryData,
} from "../../app/features/categorySlice";
import { useNavigate } from "react-router-dom";
import Loader from "../Not_Found/Loader";
import Error502 from "../Not_Found/Error502";

export default function ProductList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const products = useSelector(selectProductData);
  const totalPages = useSelector(selectTotalPages);
  const isLoading = useSelector(selectProductLoading);
  const categoryData = useSelector(selectCategoryData);
  const categoryError = useSelector(selectCategoryError);
  const categoryLoading = useSelector(selectCategoryLoading);
  const error = useSelector(selectProductError);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(null);

  useEffect(() => {
    // Fetch category data when the component mounts
    dispatch(fetchCategoryData());
  }, [dispatch]);

  useEffect(() => {
    // Fetch products only if searchTerm is 4 characters or longer
    if (searchTerm.length >= 5 || searchTerm.length === 0) {
      dispatch(fetchProductData(currentPage, selectedCategoryName, searchTerm));
    }
  }, [dispatch, currentPage, selectedCategoryName, searchTerm]);

  const handleDeleteClick = (id) => {
    setSelectedProductId(id);
    onOpen();
  };

  const handleDeleteConfirm = async () => {
    setLoading(true);
    try {
      await dispatch(deleteProduct(selectedProductId));
      setCurrentPage(1); // Reset current page if necessary
      onClose();
    } catch (error) {
      console.error("Failed to delete the product: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (id) => {
    navigate(`editproduct/${id}`);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategoryName(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFirstPage = () => handlePageChange(1);
  const handleLastPage = () => handlePageChange(totalPages);
  const handleNextPage = () => {
    if (currentPage < totalPages) handlePageChange(currentPage + 1);
  };
  const handlePrevPage = () => {
    if (currentPage > 1) handlePageChange(currentPage - 1);
  };

  const renderPaginationButtons = () => {
    const pages = [];
    if (currentPage > 2) {
      pages.push(
        <Button
          key="first"
          onClick={handleFirstPage}
          variant="outline"
          color="black"
        >
          First
        </Button>
      );
    }
    if (currentPage > 1) {
      pages.push(
        <Button
          key="prev"
          onClick={handlePrevPage}
          variant="outline"
          color="black"
        >
          Previous
        </Button>
      );
    }

    const pageRange = 3;
    let startPage = Math.max(1, currentPage - pageRange);
    let endPage = Math.min(totalPages, currentPage + pageRange);

    if (startPage > 1) {
      pages.push(
        <Button
          key="1"
          onClick={() => handlePageChange(1)}
          variant="solid"
          color="black"
        >
          1
        </Button>
      );
      if (startPage > 2) {
        pages.push(<Text key="dots1">...</Text>);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button
          key={i}
          onClick={() => handlePageChange(i)}
          colorScheme={i === currentPage ? "blue" : "gray"}
          variant="solid"
          color={i === currentPage ? "black" : "black"}
          disabled={i === currentPage}
        >
          {i}
        </Button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(<Text key="dots2">...</Text>);
      }
      pages.push(
        <Button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          variant="solid"
          color="black"
        >
          {totalPages}
        </Button>
      );
    }

    if (currentPage < totalPages) {
      pages.push(
        <Button
          key="next"
          onClick={handleNextPage}
          variant="outline"
          color="black"
        >
          Next
        </Button>
      );
    }

    if (totalPages > 2) {
      pages.push(
        <Button
          key="last"
          onClick={handleLastPage}
          colorScheme="black"
          variant="outline"
          color="white"
        >
          Last
        </Button>
      );
    }

    return pages;
  };

  return (
    <Box p={4}>
      <Flex justify="space-between" align="center" mb={4} flexWrap="wrap">
        <Text as="h2" fontSize="2xl">
          Products List
        </Text>
        <Flex>
          <Input
            placeholder="Search by model name..."
            value={searchTerm}
            onChange={handleSearchChange}
            width="55%"
            mr={2}
          />
          <Select
            name="categoryName"
            value={selectedCategoryName}
            onChange={handleCategoryChange}
            placeholder="Filter by category"
            width="45%"
            mr={2}
          >
            {categoryData.map((category) => (
              <option key={category._id} value={category.name}>
                {category.name}
              </option>
            ))}
          </Select>
          <Button
            colorScheme="teal"
            onClick={() => navigate("addproduct")}
            width="25%"
          >
            Add Product
          </Button>
        </Flex>
      </Flex>
      {/* Conditional Rendering of Loading and Error States */}
      {isLoading || categoryLoading ? (
        <Loader />
      ) : error || categoryError ? (
        <Error502 />
      ) : (
        <>
          <SimpleGrid columns={[1, 2, 3]} spacing={4}>
            {products.map((product) => (
              <Box
                key={product._id}
                borderWidth="1px"
                borderRadius="lg"
                overflow="hidden"
                boxShadow="lg"
                p={4}
                textAlign="center"
                height="100%"
              >
                <Image
                  src={product.media[0]}
                  alt={product.model}
                  borderRadius="md"
                  mb={5}
                />
                <Text fontWeight="bold" fontSize="lg">
                  {product.model}
                </Text>
                <Text fontSize="sm" color="gray.600">
                  Category: {product.categoryName}
                </Text>
                <Text fontWeight="bold" color="green.500">
                  ${product.price}{" "}
                  <Text as="span" textDecoration="line-through" color="red.500">
                    {`$${product.originalPrice}`}
                  </Text>
                </Text>
                <Text>
                  Status:{" "}
                  <Badge
                    colorScheme={
                      product.status === "available" ? "green" : "red"
                    }
                  >
                    {product.status}
                  </Badge>
                </Text>
                <Text>Storage: {product.storage}</Text>
                <Text>Condition: {product.condition}</Text>
                <Text>Warranty: {product.warranty}</Text>
                <Text>Release Year: {product.releaseYear}</Text>
                <Box mt={4}>
                  <Button
                    colorScheme="blue"
                    onClick={() => handleEditClick(product._id)}
                    mr={2}
                  >
                    Edit
                  </Button>
                  <Button
                    colorScheme="red"
                    onClick={() => handleDeleteClick(product._id)}
                  >
                    Delete
                  </Button>
                </Box>
              </Box>
            ))}
          </SimpleGrid>

          {/* Delete Confirmation Modal */}
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Delete Product</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Text>Are you sure you want to delete this product?</Text>
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  colorScheme="red"
                  onClick={handleDeleteConfirm}
                  isLoading={loading}
                  loadingText="Deleting..."
                >
                  Delete
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
          <HStack spacing={4} justifyContent="center" mt={6}>
            {renderPaginationButtons()}
          </HStack>
        </>
      )}
    </Box>
  );
}
