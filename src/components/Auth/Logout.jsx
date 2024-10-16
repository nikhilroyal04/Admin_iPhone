import React from 'react';
import {
  Box,
  Button,
  Heading,
  Text,
  useToast,
} from '@chakra-ui/react';

export default function Logout() {
  const toast = useToast();

  const handleLogout = () => {
    // Perform logout logic here
    // For example, clear user authentication data from local storage or context
    localStorage.removeItem('userToken'); // Example of clearing token

    // Show a toast notification to indicate successful logout
    toast({
      title: 'Logout Successful',
      description: 'You have been logged out.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });

    // Optionally redirect the user or update state
    // e.g., window.location.href = '/login';
  };

  return (
    <Box
      maxWidth="400px"
      mx="auto"
      mt="100px"
      p={6}
      borderWidth={1}
      borderRadius="lg"
      boxShadow="lg"
      textAlign="center"
    >
      <Heading as="h2" size="lg" mb={6}>
        Logout
      </Heading>
      <Text mb={4}>Are you sure you want to log out?</Text>
      <Button colorScheme="red" onClick={handleLogout}>
        Logout
      </Button>
    </Box>
  );
}
