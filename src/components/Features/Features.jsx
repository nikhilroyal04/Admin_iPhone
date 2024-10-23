import React, { useEffect, useState } from "react";
import {
  Box,
  Text,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  VStack,
  Tag,
  IconButton,
  HStack,
  Flex,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useToast,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  fetchFeatureData,
  deleteFeature,
  selectFeatureData,
  selectFeatureError,
  selectFeatureLoading,
  selectTotalPages,
} from "../../app/features/featureSlice";
import Loader from "../Not_Found/Loader";
import Error502 from "../Not_Found/Error502";
import { useNavigate } from "react-router-dom";
import { getModulePermissions } from "../../utils/permissions";

export default function Features() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Selectors to get feature data, loading state, and error state from the Redux store
  const featureData = useSelector(selectFeatureData);
  const totalPages = useSelector(selectTotalPages);
  const isLoading = useSelector(selectFeatureLoading);
  const error = useSelector(selectFeatureError);
  const Toast = useToast();

  // Modal state for delete confirmation
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [selectedFeatureId, setSelectedFeatureId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch feature data when the component mounts
  useEffect(() => {
    dispatch(fetchFeatureData(currentPage));
  }, [dispatch]);

  // Render loading spinner while data is being fetched
  if (isLoading) {
    return <Loader />;
  }

  // Render error message if there is an error
  if (error) {
    return <Error502 />;
  }

  // Handle delete feature
  const handleDelete = (id) => {
    setLoadingDelete(true);
    dispatch(deleteFeature(id))
      .then(() => {
        setLoadingDelete(false);
        onClose();
      })
      .catch(() => setLoadingDelete(false));
  };

  // Open modal for delete confirmation
  const confirmDelete = (id, event) => {
    event.stopPropagation();
    setSelectedFeatureId(id);
    onOpen();
  };

  // Handle edit button click
  const handleEdit = (id, event) => {
    event.stopPropagation();
    navigate(`editFeature/${id}`);
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

  const featureManageMentPermissions = getModulePermissions("Features");
  if (!featureManageMentPermissions) {
    return <Error502 />;
  }
  const canAddData = featureManageMentPermissions.create;
  const canDeleteData = featureManageMentPermissions.delete;
  const canEditData = featureManageMentPermissions.update;

  return (
    <Box p={4}>
      <Flex justify="space-between" align="center" mb={4} flexWrap="wrap">
        <Text as="h2" fontSize="2xl">
          Feature List
        </Text>
        <Button
          colorScheme="teal"
          onClick={() => {
            if (canAddData) {
              // Check if the user has permission to add features
              navigate("addFeature");
            } else {
              Toast({
                title: "You don't have permission to add features",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "top-right",
              });
            }
          }}
        >
          Add Feature
        </Button>
      </Flex>
      <Accordion allowMultiple>
        {featureData.length > 0 ? (
          featureData.map((feature) => (
            <AccordionItem key={feature._id} borderWidth="1px" mb={4}>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  <Text fontWeight="bold" fontSize="xl">
                    {feature.name}
                  </Text>
                </Box>

                {/* Spacing between buttons and accordion icon */}
                <HStack spacing={2} mr={5}>
                  <IconButton
                    aria-label="Edit feature"
                    icon={<EditIcon />}
                    size="sm"
                    onClick={(event) => {
                      if (canEditData) {
                        // Check if the user has permission to edit feature
                        handleEdit(feature._id, event);
                      } else {
                        Toast({
                          title:
                            "You don't have permission to edit this feature",
                          status: "error",
                          duration: 3000,
                          isClosable: true,
                          position: "top-right",
                        });
                      }
                    }}
                  />
                  <IconButton
                    aria-label="Delete feature"
                    icon={<DeleteIcon />}
                    size="sm"
                    colorScheme="red"
                    onClick={(event) => {
                      if (canDeleteData) {
                        // Check if the user has permission to delete feature
                        confirmDelete(feature._id, event);
                      } else {
                        Toast({
                          title:
                            "You don't have permission to delete this feature",
                          status: "error",
                          duration: 3000,
                          isClosable: true,
                          position: "top-right",
                        });
                      }
                    }}
                  />
                </HStack>

                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={4}>
                <VStack align="start">
                  {feature.description.map((desc, index) => (
                    <Box key={index} mb={2}>
                      <Text fontSize="md" fontWeight="semibold">
                        {desc.category}:
                      </Text>
                      <VStack spacing={1} pl={5}>
                        {desc.features.map((item, idx) => (
                          <Tag
                            key={idx}
                            colorScheme="blue"
                            variant="outline"
                            size="sm"
                          >
                            {item}
                          </Tag>
                        ))}
                      </VStack>
                    </Box>
                  ))}
                </VStack>
              </AccordionPanel>
            </AccordionItem>
          ))
        ) : (
          <Text>No features found.</Text>
        )}
      </Accordion>

      <HStack spacing={4} justifyContent="center" mt={6}>
        {renderPaginationButtons()}
      </HStack>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Feature</ModalHeader>
          <ModalBody>
            Are you sure you want to delete this feature? This action cannot be
            undone.
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={onClose} mr={2}>
              Cancel
            </Button>
            <Button
              colorScheme="red"
              onClick={() => handleDelete(selectedFeatureId)}
              isLoading={loadingDelete}
              loadingText="Deleting"
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
