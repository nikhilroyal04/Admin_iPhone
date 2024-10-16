import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Box,
  Spinner,
  Text,
  Alert,
  AlertIcon,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Badge,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  HStack,
  Flex,
  Select,
  Input,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import {
  selectUserData,
  selectUserError,
  selectUserLoading,
  fetchUserData,
  removeUser,
} from "../../app/features/userSlice";
import EditUser from "./EditUser";
import AddUser from "./AddUser";
import Loader from "../Not_Found/Loader";
import Error502 from "../Not_Found/Error502";

export default function UserList() {
  const dispatch = useDispatch();

  const [isEditOpen, setEditOpen] = useState(false);
  const [isAddOpen, setAddOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const cancelRef = React.useRef();

  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  // Selectors to get user data, loading state, and error state from the Redux store
  const userData = useSelector(selectUserData);
  const isLoading = useSelector(selectUserLoading);
  const error = useSelector(selectUserError);

  // Fetch user data when the component mounts
  useEffect(() => {
    dispatch(fetchUserData());
  }, [dispatch]);

  const handleEdit = (user) => {
    setSelectedUser(user);
    setEditOpen(true);
  };

  const handleAdd = () => {
    setAddOpen(true);
  };

  const handleDelete = (user) => {
    setSelectedUser(user);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedUser) {
      dispatch(removeUser(selectedUser._id));
      setDeleteOpen(false);
      setSelectedUser(null);
    }
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredUsers = () => {
    let filtered = userData;

    // Filter by status
    if (filter === "Active") {
      filtered = filtered.filter((user) => user.status === "Active");
    } else if (filter === "Inactive") {
      filtered = filtered.filter((user) => user.status === "Inactive");
    }

    // Filter by search term (name, email, phone)
    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.phoneNumber.includes(searchTerm)
      );
    }

    return filtered; // Return filtered users
  };

  if (isLoading) {
    return <Loader />;
  }

  // Render error message if there is an error
  if (error) {
    return <Error502 />;
  }

  return (
    <Box p={4} overflow="auto">
      {/* Responsive Header */}
      <Flex justify="space-between" align="center" mb={4}>
        <Grid
          templateColumns={{ base: "1fr", md: "repeat(4, 1fr)" }}
          gap={4}
          width="100%"
        >
          <GridItem>
            <Text fontSize="2xl">User List</Text>
          </GridItem>
          <GridItem>
            <Input
              placeholder="Search by name, email, or phone"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </GridItem>
          <GridItem>
            <Select
              placeholder="Filter by status"
              value={filter}
              onChange={handleFilterChange}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </Select>
          </GridItem>
          <GridItem>
            <Button onClick={handleAdd} colorScheme="green" width="100%">
              Add New User
            </Button>
          </GridItem>
        </Grid>
      </Flex>

      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Email</Th>
            <Th>Phone</Th>
            <Th>Status</Th>
            <Th>Role</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filteredUsers() && filteredUsers().length > 0 ? (
            filteredUsers().map((user) => (
              <Tr key={user._id}>
                <Td>{user.name}</Td>
                <Td>{user.email}</Td>
                <Td>{user.phoneNumber}</Td>
                <Td>
                  <Badge
                    colorScheme={user.status === "Active" ? "green" : "red"}
                    borderRadius="full"
                    px={3}
                    py={1}
                  >
                    {user.status}
                  </Badge>
                </Td>
                <Td>
                  <Badge
                    colorScheme={user.role === "Admin" ? "blue" : "gray"}
                    borderRadius="full"
                    px={3}
                    py={1}
                  >
                    {user.role}
                  </Badge>
                </Td>
                <Td>
                  <HStack>
                    <Button
                      colorScheme="blue"
                      mr={2}
                      size="md"
                      onClick={() => handleEdit(user)}
                    >
                      Edit
                    </Button>
                    <Button
                      colorScheme="red"
                      size="md"
                      onClick={() => handleDelete(user)}
                    >
                      Delete
                    </Button>
                  </HStack>
                </Td>
              </Tr>
            ))
          ) : (
            <Tr>
              <Td colSpan={6} textAlign="center">
                No users found.
              </Td>
            </Tr>
          )}
        </Tbody>
      </Table>

      {/* Edit User Modal */}
      <EditUser
        isOpen={isEditOpen}
        onClose={() => setEditOpen(false)}
        user={selectedUser}
      />

      {/* Add User Modal */}
      <AddUser
        isOpen={isAddOpen}
        onClose={() => setAddOpen(false)}
        handleAddUser={(newUser) => {
          setAddOpen(false);
        }}
      />

      {/* Delete Confirmation Modal */}
      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setDeleteOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Confirm Deletion</AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to delete {selectedUser?.name}?
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setDeleteOpen(false)}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleConfirmDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
}
