import React from 'react';
import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Divider,
  VStack,
} from '@chakra-ui/react';
import Loader from "../Not_Found/Loader";
import Error502 from "../Not_Found/Error502";

export default function Dashboard() {
  return (
    <Box p={4}>
      <Heading as="h1" size="lg" mb={6}>
        Dashboard
      </Heading>

      {/* Statistics Section */}
      <SimpleGrid columns={[1, 2, 3]} spacing={4} mb={6}>
        <Stat>
          <StatLabel>Total Users</StatLabel>
          <StatNumber>1,234</StatNumber>
          <StatHelpText>Updated 2 hours ago</StatHelpText>
        </Stat>
        <Stat>
          <StatLabel>Total Sales</StatLabel>
          <StatNumber>$12,345</StatNumber>
          <StatHelpText>Updated 1 hour ago</StatHelpText>
        </Stat>
        <Stat>
          <StatLabel>Active Products</StatLabel>
          <StatNumber>56</StatNumber>
          <StatHelpText>Updated just now</StatHelpText>
        </Stat>
      </SimpleGrid>

      <Divider />

      {/* Recent Activities Section */}
      <VStack spacing={4} align="stretch" mt={6}>
        <Heading as="h2" size="md">Recent Activities</Heading>
        <Box
          borderWidth="1px"
          borderRadius="lg"
          overflow="hidden"
          p={4}
          bg="gray.50"
        >
          <Text fontWeight="bold">User John Doe signed up.</Text>
          <Text color="gray.600">2 hours ago</Text>
        </Box>
        <Box
          borderWidth="1px"
          borderRadius="lg"
          overflow="hidden"
          p={4}
          bg="gray.50"
        >
          <Text fontWeight="bold">Product ABC was sold.</Text>
          <Text color="gray.600">3 hours ago</Text>
        </Box>
        <Box
          borderWidth="1px"
          borderRadius="lg"
          overflow="hidden"
          p={4}
          bg="gray.50"
        >
          <Text fontWeight="bold">User Jane Smith updated their profile.</Text>
          <Text color="gray.600">5 hours ago</Text>
        </Box>
      </VStack>
    </Box>
  );
}
