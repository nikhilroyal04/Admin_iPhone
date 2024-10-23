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
  useToast,
} from "@chakra-ui/react";
import {
  selectUserData,
  selectUserError,
  selectUserLoading,
  fetchUserData,
  removeUser,
  selectTotalPages,
} from "../../app/features/userSlice";
import EditUser from "./EditUser";
import AddUser from "./AddUser";
import Loader from "../Not_Found/Loader";
import Error502 from "../Not_Found/Error502";
import { getModulePermissions } from "../../utils/permissions";

export default function UserList() {
  const dispatch = useDispatch();

  const [isEditOpen, setEditOpen] = useState(false);
  const [isAddOpen, setAddOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const cancelRef = React.useRef();
  const Toast = useToast();

  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Selectors to get user data, loading state, and error state from the Redux store
  const userData = useSelector(selectUserData);
  const totalPages = useSelector(selectTotalPages);
  const isLoading = useSelector(selectUserLoading);
  const error = useSelector(selectUserError);

  // Fetch user data when the component mounts
  useEffect(() => {
    dispatch(fetchUserData(currentPage));
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

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFirstPage = () => handlePageChange(1);
  const handleLastPage = () => handlePageChange(totalPages);
  const handleNextPage = () => {
    if (currentPage < totalPages) handlePageChange(currentPage + 1);
  };
  const handlePrevPage = () => {
    if (currentPage > 1) handlePageChange(currentPage - 1);
  };

  const renderPaginationButtons = () => {
    const pages = [];
    if (currentPage > 2) {
      pages.push(
        <Button
          key="first"
          onClick={handleFirstPage}
          variant="outline"
          color="black"
        >
          First
        </Button>
      );
    }
    if (currentPage > 1) {
      pages.push(
        <Button
          key="prev"
          onClick={handlePrevPage}
          variant="outline"
          color="black"
        >
          Previous
        </Button>
      );
    }

    const pageRange = 3;
    let startPage = Math.max(1, currentPage - pageRange);
    let endPage = Math.min(totalPages, currentPage + pageRange);

    if (startPage > 1) {
      pages.push(
        <Button
          key="1"
          onClick={() => handlePageChange(1)}
          variant="solid"
          color="black"
        >
          1
        </Button>
      );
      if (startPage > 2) {
        pages.push(<Text key="dots1">...</Text>);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button
          key={i}
          onClick={() => handlePageChange(i)}
          colorScheme={i === currentPage ? "blue" : "gray"}
          variant="solid"
          color={i === currentPage ? "black" : "black"}
          disabled={i === currentPage}
        >
          {i}
        </Button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(<Text key="dots2">...</Text>);
      }
      pages.push(
        <Button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          variant="solid"
          color="black"
        >
          {totalPages}
        </Button>
      );
    }

    if (currentPage < totalPages) {
      pages.push(
        <Button
          key="next"
          onClick={handleNextPage}
          variant="outline"
          color="black"
        >
          Next
        </Button>
      );
    }

    if (totalPages > 2) {
      pages.push(
        <Button
          key="last"
          onClick={handleLastPage}
          colorScheme="black"
          variant="outline"
          color="white"
        >
          Last
        </Button>
      );
    }

    return pages;
  };

  const userManageMentPermissions = getModulePermissions("Users");
  if (!userManageMentPermissions) {
    return <Error502 />;
  }
  const canAddData = userManageMentPermissions.create;
  const canDeleteData = userManageMentPermissions.delete;
  const canEditData = userManageMentPermissions.update;

  return (
    <Box p={4}>
      {/* Responsive Header */}
      <Flex justify="space-between" align="center" mb={4} flexWrap="wrap">
        <Text
          as="h2"
          fontSize="2xl"
          flex={{ base: "1 1 100%", md: "0 1 auto" }}
        >
          User List
        </Text>
        <Flex
          direction={{ base: "column", sm: "row" }}
          justify={{ base: "flex-start", md: "flex-end" }}
          width={{ base: "100%", md: "auto" }}
          mt={{ base: 3, md: 0 }}
        >
          <Input
            placeholder="Search by name, email, or phone"
            value={searchTerm}
            onChange={handleSearchChange}
            mr={2}
          />

          <Select
            placeholder="Filter by status"
            value={filter}
            onChange={handleFilterChange}
            mr={2}
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </Select>

          <Button
            onClick={() => {
              if (canAddData) {
                handleAdd();
              } else {
                Toast({
                  title: "You don't have permission to add user",
                  status: "error",
                  duration: 3000,
                  isClosable: true,
                  position: "top-right",
                });
              }
            }}
            colorScheme="green"
            width="100%"
          >
            Add User
          </Button>
        </Flex>
      </Flex>
      <Box
        overflow="auto"
        css={{
          "&::-webkit-scrollbar": {
            width: "8px",
            height: "8px",
            backgroundColor: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#cbd5e0",
            borderRadius: "10px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#a0aec0",
          },
        }}
      >
        <Table variant="simple" overflow="auto">
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
                        onClick={() => {
                          if (canEditData) {
                            handleEdit(user);
                          } else {
                            Toast({
                              title:
                                "You don't have permission to edit this user",
                              status: "error",
                              duration: 3000,
                              isClosable: true,
                              position: "top-right",
                            });
                          }
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        colorScheme="red"
                        size="md"
                        onClick={() => {
                          if (canDeleteData) {
                            handleDelete(user);
                          } else {
                            Toast({
                              title:
                                "You don't have permission to delete this user",
                              status: "error",
                              duration: 3000,
                              isClosable: true,
                              position: "top-right",
                            });
                          }
                        }}
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
      </Box>
      <HStack spacing={4} justifyContent="center" mt={6}>
        {renderPaginationButtons()}
      </HStack>
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
