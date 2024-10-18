import React from "react";
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
  Flex,
  Icon,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { FaUsers, FaDollarSign, FaBoxOpen } from "react-icons/fa";
import Loader from "../Not_Found/Loader";
import Error502 from "../Not_Found/Error502";

export default function Dashboard() {
  return (
    <Box p={4} minHeight="100vh">
      {/* Statistics Section */}
      <SimpleGrid columns={[1, 2, 3]} spacing={4} mb={6}>
        <Stat
          p={4}
          borderRadius="lg"
          bg="white"
          shadow="md"
          transition="0.3s"
          _hover={{ shadow: "lg", transform: "translateY(-2px)" }}
        >
          <Flex align="center">
            <Icon as={FaUsers} w={8} h={8} color="teal.500" mr={2} />
            <StatLabel>Total Users</StatLabel>
          </Flex>
          <StatNumber fontSize="2xl">1,234</StatNumber>
          <StatHelpText color="gray.500">Updated 2 hours ago</StatHelpText>
        </Stat>

        <Stat
          p={4}
          borderRadius="lg"
          bg="white"
          shadow="md"
          transition="0.3s"
          _hover={{ shadow: "lg", transform: "translateY(-2px)" }}
        >
          <Flex align="center">
            <Icon as={FaDollarSign} w={8} h={8} color="green.500" mr={2} />
            <StatLabel>Total Sales</StatLabel>
          </Flex>
          <StatNumber fontSize="2xl">$12,345</StatNumber>
          <StatHelpText color="gray.500">Updated 1 hour ago</StatHelpText>
        </Stat>

        <Stat
          p={4}
          borderRadius="lg"
          bg="white"
          shadow="md"
          transition="0.3s"
          _hover={{ shadow: "lg", transform: "translateY(-2px)" }}
        >
          <Flex align="center">
            <Icon as={FaBoxOpen} w={8} h={8} color="orange.500" mr={2} />
            <StatLabel>Active Products</StatLabel>
          </Flex>
          <StatNumber fontSize="2xl">56</StatNumber>
          <StatHelpText color="gray.500">Updated just now</StatHelpText>
        </Stat>
      </SimpleGrid>

      <Divider />

      {/* Recent Activities Section */}
      <VStack spacing={4} align="stretch" mt={6}>
        <Heading as="h2" size="md" color="teal.600">
          Recent Activities
        </Heading>
        <Grid templateColumns="repeat(2, 1fr)" gap={4}>
          <GridItem>
            <Box
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
              p={4}
              bg="white"
              shadow="sm"
              transition="0.3s"
              _hover={{ shadow: "md", transform: "translateY(-2px)" }}
            >
              <Text fontWeight="bold">User John Doe signed up.</Text>
              <Text color="gray.600">2 hours ago</Text>
            </Box>
          </GridItem>
          <GridItem>
            <Box
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
              p={4}
              bg="white"
              shadow="sm"
              transition="0.3s"
              _hover={{ shadow: "md", transform: "translateY(-2px)" }}
            >
              <Text fontWeight="bold">Product ABC was sold.</Text>
              <Text color="gray.600">3 hours ago</Text>
            </Box>
          </GridItem>
          <GridItem>
            <Box
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
              p={4}
              bg="white"
              shadow="sm"
              transition="0.3s"
              _hover={{ shadow: "md", transform: "translateY(-2px)" }}
            >
              <Text fontWeight="bold">
                User Jane Smith updated their profile.
              </Text>
              <Text color="gray.600">5 hours ago</Text>
            </Box>
          </GridItem>
        </Grid>
      </VStack>
    </Box>
  );
}
