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
  Heading,
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
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  fetchFeatureData,
  deleteFeature,
  selectFeatureData,
  selectFeatureError,
  selectFeatureLoading,
} from "../../app/features/featureSlice";
import Loader from "../Not_Found/Loader";
import Error502 from "../Not_Found/Error502";
import { useNavigate } from "react-router-dom";

export default function Features() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Selectors to get feature data, loading state, and error state from the Redux store
  const featureData = useSelector(selectFeatureData);
  const isLoading = useSelector(selectFeatureLoading);
  const error = useSelector(selectFeatureError);

  // Modal state for delete confirmation
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [selectedFeatureId, setSelectedFeatureId] = useState(null);

  // Fetch feature data when the component mounts
  useEffect(() => {
    dispatch(fetchFeatureData());
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
    event.stopPropagation(); // Prevent accordion from opening
    setSelectedFeatureId(id);
    onOpen();
  };

  // Handle edit button click
  const handleEdit = (id, event) => {
    event.stopPropagation(); // Prevent accordion from opening
    navigate(`editFeature/${id}`);
  };

  return (
    <Box p={4}>
      <Flex justify="space-between" align="center" mb={4} flexWrap="wrap">
        <Text as="h2" fontSize="2xl">
          Feature List
        </Text>
        <Button colorScheme="teal" onClick={() => navigate("addFeature")}>
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
                    onClick={(event) => handleEdit(feature._id, event)}
                  />
                  <IconButton
                    aria-label="Delete feature"
                    icon={<DeleteIcon />}
                    size="sm"
                    colorScheme="red"
                    onClick={(event) => confirmDelete(feature._id, event)}
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
