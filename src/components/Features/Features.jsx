import React, { useEffect } from "react";
import {
  Box,
  Text,
  Spinner,
  Alert,
  AlertIcon,
  SimpleGrid,
  Heading,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchFeatureData,
//   selectFeatureData,
//   selectFeatureError,
//   selectFeatureLoading,
// } from "../../app/features/featureSlice"; 
import Loader from "../Not_Found/Loader";
import Error502 from "../Not_Found/Error502";

export default function Features() {
  const dispatch = useDispatch();

  // Selectors to get feature data, loading state, and error state from the Redux store
  // const features = useSelector(selectFeatureData);
  // const isLoading = useSelector(selectFeatureLoading);
  // const error = useSelector(selectFeatureError);

  // Fetch feature data when the component mounts
  // useEffect(() => {
  //   dispatch(fetchFeatureData());
  // }, [dispatch]);

  // Render loading spinner while data is being fetched
  // if (isLoading) {
  //   return (
  //     <Box
  //       display="flex"
  //       alignItems="center"
  //       justifyContent="center"
  //       height="100vh"
  //     >
  //       <Spinner size="xl" />
  //     </Box>
  //   );
  // }

  // // Render error message if there is an error
  // if (error) {
  //   return (
  //     <Box p={4}>
  //       <Alert status="error">
  //         <AlertIcon />
  //         {error}
  //       </Alert>
  //     </Box>
  //   );
  // }

  const features = [
    {
      id: 1,
      name: "Fast Delivery",
      description: "Get your products delivered within 24 hours.",
    },
    {
      id: 2,
      name: "Easy Returns",
      description: "Hassle-free return process within 30 days.",
    },
    {
      id: 3,
      name: "24/7 Support",
      description: "Our support team is available around the clock.",
    },
    // Add more features as necessary
  ];
  

  return (
    <Box p={4}>
      <Heading as="h2" size="lg" mb={6}>
        Features
      </Heading>
      <SimpleGrid columns={[1, 2, 3]} spacing={4}>
        {features.length > 0 ? (
          features.map((feature) => (
            <Box
              key={feature.id} // Ensure to use a unique id
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
              boxShadow="lg"
              p={4}
              textAlign="left"
            >
              <Text fontWeight="bold">{feature.name}</Text>
              <Text>{feature.description}</Text>
            </Box>
          ))
        ) : (
          <Text>No features found.</Text>
        )}
      </SimpleGrid>
    </Box>
  );
}
