import React, { useEffect, useState } from "react";
import {
  Box,
  Text,
  Flex,
  Grid,
  GridItem,
  Card,
  CardHeader,
  Divider,
  CardBody,
  FormControl,
  FormLabel,
  Input,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  IconButton,
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchRoleData,
  selectRoleData,
  selectRoleError,
  selectRoleLoading,
  removeRole,
  addRole,
} from "../../app/features/roleSlice";
import Loader from "../Not_Found/Loader";
import Error502 from "../Not_Found/Error502";
import { useNavigate } from "react-router-dom";

export default function Roles() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const roleData = useSelector(selectRoleData);
  const isLoading = useSelector(selectRoleLoading);
  const error = useSelector(selectRoleError);

  const [newRoleName, setNewRoleName] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [isHovered, setIsHovered] = useState(null);
  const [isAddingRole, setIsAddingRole] = useState(false);

  useEffect(() => {
    dispatch(fetchRoleData());
  }, [dispatch]);

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <Error502 />;
  }

  const handleAddRole = () => {
    if (!newRoleName) return;
    setIsAddingRole(true);
    // dispatch(addRole(newRoleName)).finally(() => {
    //   setIsAddingRole(false);
    //   setNewRoleName("");
    // });
  };

  const handleEditRole = (roleId) => {
    navigate(`editrole/${roleId}`);
  };

  const handleDeleteRole = (role) => {
    setSelectedRole(role);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteRole = () => {
    if (selectedRole) {
      dispatch(removeRole(selectedRole._id));
      setIsDeleteModalOpen(false);
      setSelectedRole(null);
    }
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedRole(null);
  };

  return (
    <Flex
      mt={10}
      ml="5%"
      mr="5%"
      p={4}
      borderRadius="md"
      overflow="auto"
      wrap="wrap"
      gap={4}
    >
      <Grid
        templateColumns={{ base: "1fr", lg: "1fr 1fr" }}
        gap={4}
        width="100%"
      >
        <GridItem>
          <Card width="100%" p={4} borderRadius="md" height="250px">
            <CardHeader>
              <Box fontSize="lg" fontWeight="bold">
                Role
              </Box>
            </CardHeader>
            <Divider />
            <CardBody>
              <FormControl isRequired>
                <FormLabel>Name</FormLabel>
                <Input
                  isRequired
                  placeholder="New role name"
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  mb={3}
                />
              </FormControl>
              <Flex justify="flex-end">
                <Button
                  size="sm"
                  onClick={handleAddRole}
                  colorScheme="blue"
                  isLoading={isAddingRole} // Loading state for the button
                >
                  Save
                </Button>
              </Flex>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem>
          <Card
            p={4}
            bg="white"
            borderRadius="md"
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
            <CardHeader>
              <Box fontSize="lg" fontWeight="bold">
                Roles List
              </Box>
            </CardHeader>
            <CardBody>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Role</Th>
                    <Th textAlign="center">Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {roleData.map((role) => (
                    <Tr
                      key={role.roleId}
                      _hover={{
                        boxShadow:
                          "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)",
                      }}
                    >
                      <Td>{role.roleName}</Td>
                      <Td>
                        <Flex justify="center">
                          {role._id !== 1 && (
                            <>
                              <IconButton
                                aria-label="Edit role"
                                icon={<EditIcon />}
                                onClick={() => handleEditRole(role._id)}
                                mr={2}
                                colorScheme="blue"
                                onMouseEnter={() =>
                                  setIsHovered(`edit_${role._id}`)
                                }
                                onMouseLeave={() => setIsHovered(null)}
                                fontSize={
                                  isHovered === `edit_${role._id}`
                                    ? "24px"
                                    : "16px"
                                }
                                transition="font-size 0.3s ease"
                              />
                              <IconButton
                                aria-label="Delete role"
                                icon={<DeleteIcon />}
                                onClick={() => handleDeleteRole(role)}
                                colorScheme="red"
                                onMouseEnter={() =>
                                  setIsHovered(`delete_${role._id}`)
                                }
                                onMouseLeave={() => setIsHovered(null)}
                                fontSize={
                                  isHovered === `delete_${role._id}`
                                    ? "24px"
                                    : "16px"
                                }
                                transition="font-size 0.3s ease"
                              />
                            </>
                          )}
                        </Flex>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </CardBody>
          </Card>
        </GridItem>
      </Grid>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        size="sm"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Deletion</ModalHeader>
          <ModalBody>
            <Text>Are you sure you want to delete this role?</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={confirmDeleteRole}>
              Delete
            </Button>
            <Button onClick={handleCloseDeleteModal}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
}
