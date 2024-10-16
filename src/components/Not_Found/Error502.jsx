import React from "react";
import { Box, Text, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export default function Error502() {
  const navigate = useNavigate();

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      textAlign="center"
    >
      <Text fontSize="6xl" fontWeight="bold" color="red.500">
        502
      </Text>
      <Text fontSize="2xl" mt={2} color="gray.600">
        Bad Gateway
      </Text>
      <Text fontSize="md" mt={2} color="gray.500">
        The server encountered a temporary error and could not complete your request.
      </Text>

      <Button
        mt={6}
        colorScheme="blue"
        onClick={handleReload}
      >
        Retry
      </Button>

      <Button
        mt={4}
        colorScheme="teal"
        onClick={() => navigate("/")}
      >
        Go to Home
      </Button>
    </Box>
  );
}
