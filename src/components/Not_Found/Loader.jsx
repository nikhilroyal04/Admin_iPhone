import React from "react";
import { Box, Spinner, Text } from "@chakra-ui/react";

export default function Loader() {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
    >
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="blue.500"
        size="xl"
      />
      <Text mt={4} fontSize="lg" color="gray.600">
        Loading...
      </Text>
    </Box>
  );
}
