import React from 'react';
import { Box, Heading, Text, Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/'); // Redirect to home page
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      textAlign="center"
      p={4}
    >
      <Heading as="h1" size="4xl" mb={4}>
        404
      </Heading>
      <Text fontSize="lg" mb={6}>
        Oops! The page you are looking for does not exist.
      </Text>
      <Button colorScheme="blue" onClick={handleGoHome}>
        Go to Home
      </Button>
    </Box>
  );
}
