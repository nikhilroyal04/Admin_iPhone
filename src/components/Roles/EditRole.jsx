import React, { useState, useEffect } from "react";
import {
  Box,
  Checkbox,
  Divider,
  Heading,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Button,
  Flex,
  Spinner,
  Input,
  IconButton,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchRoleById,
  selectSelectedRole,
  editRole,
  selectRoleError,
  selectRoleLoading,
} from "../../app/features/roleSlice";
import { EditIcon } from "@chakra-ui/icons";
import Error502 from "../Not_Found/Error502";
import Loader from "../Not_Found/Loader";

export default function EditRoles() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const roleData = useSelector(selectSelectedRole);
  const loading = useSelector(selectRoleLoading);
  const error = useSelector(selectRoleError);

  const [role, setRole] = useState(null);
  const [roleName, setRoleName] = useState("");
  const [permissions, setPermissions] = useState([]);
  const [isEditingRoleName, setIsEditingRoleName] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    dispatch(fetchRoleById(id));
  }, [dispatch]);

  useEffect(() => {
    if (roleData) {
      setRoleName(roleData.roleName);

      const permissionsData = JSON.parse(roleData.permission);

      const permissionsArray = permissionsData.map((permission) => ({
        module: permission.module,
        pageRoute: permission.pageRoute,
        permissionsList: permission.permissionsList,
      }));
      setPermissions(permissionsArray);
    }
  }, [roleData, id]);

  const togglePermission = (moduleIndex, crudIndex) => {
    setPermissions((prevPermissions) => {
      const updatedPermissions = [...prevPermissions];
      updatedPermissions[moduleIndex] = {
        ...updatedPermissions[moduleIndex],
        permissionsList: {
          ...updatedPermissions[moduleIndex].permissionsList,
          [Object.keys(updatedPermissions[moduleIndex].permissionsList)[
            crudIndex
          ]]:
            !updatedPermissions[moduleIndex].permissionsList[
              Object.keys(updatedPermissions[moduleIndex].permissionsList)[
                crudIndex
              ]
            ],
        },
      };
      return updatedPermissions;
    });
  };

  const onSave = async () => {
    setIsSaving(true);
    const updatedPermissions = permissions.map(
      ({ module, pageRoute, permissionsList }) => ({
        module,
        pageRoute,
        permissionsList: {
          read: permissionsList.read === true,
          create: permissionsList.create === true,
          update: permissionsList.update === true,
          delete: permissionsList.delete === true,
        },
      })
    );

    const updatedRoleData = {
      ...role,
      roleName: roleName,
      permission: JSON.stringify(updatedPermissions),
      updatedOn: Date.now(),
    };

    await dispatch(editRole(id, updatedRoleData));
    setIsSaving(false);
    navigate("/roles");
    setIsEditingRoleName(false);
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <Error502 />;
  }

  return (
    <Box
      p="4"
      ml={4}
      mr={4}
      mt={4}
      bg="white"
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
      <Flex alignItems="center" mb="4">
        {isEditingRoleName ? (
          <Input
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            size="lg"
            maxWidth={250}
            mr={2}
          />
        ) : (
          <Heading mb="0">{roleName}</Heading>
        )}
        <IconButton
          icon={<EditIcon />}
          size="sm"
          onClick={() => setIsEditingRoleName(!isEditingRoleName)}
          ml={2}
          mt={1}
        />
      </Flex>
      <Divider mb={5} borderWidth="1px" borderColor="black" />
      <Table variant="striped" colorScheme="gray">
        <Thead>
          <Tr>
            <Th>Module</Th>
            <Th>Read</Th>
            <Th>Create</Th>
            <Th>Update</Th>
            <Th>Delete</Th>
          </Tr>
        </Thead>
        <Tbody>
          {permissions.map(({ module, permissionsList }, moduleIndex) => (
            <Tr key={moduleIndex}>
              <Td>{module}</Td>
              {Object.values(permissionsList).map((crud, crudIndex) => (
                <Td key={crudIndex}>
                  <Checkbox
                    isChecked={crud}
                    onChange={() => togglePermission(moduleIndex, crudIndex)}
                  />
                </Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>
      <Flex justify="flex-end" mt={4} mr={2}>
        <Button
          colorScheme="blue"
          onClick={onSave}
          isLoading={isSaving}
          isDisabled={isSaving}
        >
          {isSaving ? "Saving..." : "Save"}
        </Button>
      </Flex>
    </Box>
  );
}
