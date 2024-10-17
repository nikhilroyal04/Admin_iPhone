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
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchFeatureData,
  selectFeatureData,
  selectFeatureError,
  selectFeatureLoading,
} from "../../app/features/featureSlice";
import Loader from "../Not_Found/Loader";
import Error502 from "../Not_Found/Error502";

export default function Features() {
  const dispatch = useDispatch();

  // Selectors to get feature data, loading state, and error state from the Redux store
  const featureData = useSelector(selectFeatureData);
  const isLoading = useSelector(selectFeatureLoading);
  const error = useSelector(selectFeatureError);

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

  console.log("features", featureData);

  return (
    <Box p={4}>
      <Heading as="h2" size="lg" mb={6}>
        Features
      </Heading>
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
    </Box>
  );
}
