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
import { useNavigate } from "react-router-dom";
import Loader from "../Not_Found/Loader";
import Error502 from "../Not_Found/Error502";

export default function ProductList() {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize history for navigation
  const products = useSelector(selectProductData);
  const totalPages = useSelector(selectTotalPages);
  const isLoading = useSelector(selectProductLoading);
  const error = useSelector(selectProductError);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(fetchProductData(currentPage));
  }, [dispatch, currentPage]);

  const handleDeleteClick = (id) => {
    setSelectedProductId(id);
    onOpen();
  };

  const handleDeleteConfirm = () => {
    dispatch(deleteProduct(selectedProductId));
    onClose();
  };

  const handleEditClick = (id) => {
    navigate(`editproduct/${id}`); // Navigate to edit page with product ID
  };

  if (isLoading) {
    return <Loader />;
  }

  // Render error message if there is an error
  if (error) {
    return <Error502 />;
  }

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
        <Button key="first" onClick={handleFirstPage}>
          First
        </Button>
      );
    }

    if (currentPage > 1) {
      pages.push(
        <Button key="prev" onClick={handlePrevPage}>
          Previous
        </Button>
      );
    }

    const pageRange = 3;
    let startPage = Math.max(1, currentPage - pageRange);
    let endPage = Math.min(totalPages, currentPage + pageRange);

    if (startPage > 1) {
      pages.push(
        <Button key="1" onClick={() => handlePageChange(1)}>
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
          colorScheme={i === currentPage ? "teal" : undefined}
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
        <Button key={totalPages} onClick={() => handlePageChange(totalPages)}>
          {totalPages}
        </Button>
      );
    }

    if (currentPage < totalPages) {
      pages.push(
        <Button key="next" onClick={handleNextPage}>
          Next
        </Button>
      );
    }

    if (totalPages > 2) {
      pages.push(
        <Button key="last" onClick={handleLastPage}>
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
            placeholder="Search..."
            // value={searchTerm}
            // onChange={handleSearchChange}
            width="65%"
            mr={2}
          />
          <Button
            colorScheme="teal"
            onClick={() => navigate("addproduct")}
            width="35%"
          >
            Add Product
          </Button>
        </Flex>
      </Flex>
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
          >
            <Image
              src={product.media[0]}
              alt={product.model}
              borderRadius="md"
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
                colorScheme={product.status === "available" ? "green" : "red"}
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
            <Button colorScheme="red" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {products.length >= 20 && (
        <HStack spacing={4} justifyContent="center" mt={6}>
          {renderPaginationButtons()}
        </HStack>
      )}
    </Box>
  );
}
