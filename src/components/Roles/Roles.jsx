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
import {
  fetchRoleData,
  selectRoleData,
  selectRoleError,
  selectRoleLoading,
} from "../../app/features/roleSlice";
import Loader from "../Not_Found/Loader";
import Error502 from "../Not_Found/Error502";

export default function Roles() {
  const dispatch = useDispatch();

  // Selectors to get role data, loading state, and error state from the Redux store
  const roleData = useSelector(selectRoleData);
  const isLoading = useSelector(selectRoleLoading);
  const error = useSelector(selectRoleError);

  // Fetch role data when the component mounts
  useEffect(() => {
    dispatch(fetchRoleData());
  }, [dispatch]);

  // Render loading spinner while data is being fetched
  if (isLoading) {
    return <Loader />;
  }

  // Render error message if there is an error
  if (error) {
    return <Error502 />;
  }

  console.log("data",roleData)

  return (
    <Box p={4}>
      <Heading as="h2" size="lg" mb={6}>
        Roles
      </Heading>
      <SimpleGrid columns={[1, 2, 3]} spacing={4}>
        {roleData.map((role) => (
          <Box
            key={role._id}
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            boxShadow="lg"
            p={4}
            textAlign="center"
          >
            <Text fontWeight="bold">{role.roleName}</Text>
            <Text fontSize="sm" color="gray.600">
              {role.status}
            </Text>
            <Text fontSize="sm" color="gray.600">
              {role.permission}
            </Text>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
}
