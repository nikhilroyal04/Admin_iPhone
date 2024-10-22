import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  SimpleGrid,
  Button,
  Flex,
  HStack,
  Input,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAddressData,
  selectTotalPages,
  selectAddressData,
  selectAddressLoading,
  selectAddressError,
  deleteAddress,
} from "../../app/features/addressSlice";
import Loader from "../Not_Found/Loader";
import Error502 from "../Not_Found/Error502";
import EditAddress from "./EditAddress";
import AddAddress from "./AddAddress";

export default function Address() {
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // For handling Add and Edit modals
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

  const [editData, setEditData] = useState(null);

  // Selectors to get address data, loading state, and error state from the Redux store
  const addressData = useSelector(selectAddressData);
  const totalPages = useSelector(selectTotalPages);
  const isLoading = useSelector(selectAddressLoading);
  const error = useSelector(selectAddressError);

  // Fetch address data when the component mounts
  useEffect(() => {
    dispatch(fetchAddressData(currentPage));
  }, [dispatch, currentPage]);

  // Handle delete confirmation
  const handleDelete = (address) => {
    setSelectedAddress(address);
    onOpen();
  };

  const confirmDelete = () => {
    dispatch(deleteAddress(selectedAddress._id));
    onClose();
  };

  // Handle edit button click
  const handleEdit = (address) => {
    setEditData(address);
    onEditOpen();
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

  if (isLoading) {
    return <Loader />;
  }

  // Render error message if there is an error
  if (error) {
    return <Error502 />;
  }

  return (
    <Box p={4}>
      <Flex justify="space-between" align="center" mb={4} flexWrap="wrap">
        <Text as="h2" fontSize="2xl">
          Addresses
        </Text>
        <Flex spacing={4}>
          {/* <Input placeholder="Search by username" width="65%" mr={2} /> */}

          <Button colorScheme="teal" onClick={onAddOpen} mt={2}>
            Add Address
          </Button>
        </Flex>
      </Flex>
      <SimpleGrid columns={[1, 1, 2, 2, 3]} spacing={4}>
        {addressData.length || [] > 0 ? (
          addressData.map((address) => (
            <Box key={address._id} borderWidth="1px" borderRadius="lg" p={4}>
              <Text as="h3" fontWeight="bold" mb={2}>
                {address.name}
              </Text>
              <Text as="h3" fontWeight="bold" mb={2}>
                {address.userId}
              </Text>
              <Text>{address.addressLine1}</Text>
              {address.landmark && <Text>Landmark: {address.landmark}</Text>}
              <Text>{address.locality}</Text>
              <Text>
                {address.city}, {address.state} - {address.pincode}
              </Text>
              <Text>Email: {address.email}</Text>
              <Text>Phone: {address.phoneNumber}</Text>
              <Flex mt={2}>
                <Button
                  colorScheme="blue"
                  onClick={() => handleEdit(address)}
                  size="sm"
                >
                  Edit
                </Button>
                <Button
                  colorScheme="red"
                  ml={2}
                  onClick={() => handleDelete(address)}
                  size="sm"
                >
                  Delete
                </Button>
              </Flex>
            </Box>
          ))
        ) : (
          <Text>No addresses found.</Text>
        )}
      </SimpleGrid>
      <HStack spacing={4} justifyContent="center" mt={6}>
        {renderPaginationButtons()}
      </HStack>

      {/* Delete Confirmation Modal */}
      <AlertDialog isOpen={isOpen} leastDestructiveRef={null} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Address
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You can't undo this action.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button onClick={onClose}>Cancel</Button>
              <Button colorScheme="red" onClick={confirmDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      {/* Edit Modal */}
      {isEditOpen && (
        <EditAddress
          isOpen={isEditOpen}
          onClose={onEditClose}
          address={editData}
        />
      )}

      {/* Add Modal */}
      {isAddOpen && <AddAddress isOpen={isAddOpen} onClose={onAddClose} />}
    </Box>
  );
}
