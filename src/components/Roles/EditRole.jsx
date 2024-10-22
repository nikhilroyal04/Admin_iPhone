import React, { useEffect, useState } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  Flex,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchRoleById,
  selectSelectedRole,
  selectRoleLoading,
  editRole,
  selectRoleError,
} from "../../app/features/roleSlice";
import Loader from "../Not_Found/Loader";
import Error502 from "../Not_Found/Error502";

export default function EditRole() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const selectedRole = useSelector(selectSelectedRole);
  const isLoading = useSelector(selectRoleLoading);
  const error = useSelector(selectRoleError);

  const [roleName, setRoleName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchRoleById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (selectedRole) {
      setRoleName(selectedRole.roleName);
    }
  }, [selectedRole]);

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <Error502 />;
  }

  const handleUpdateRole = () => {
    if (!roleName) return;
    setIsSubmitting(true);
    // dispatch(editRole({ id, roleName })).then(() => {
    //   setIsSubmitting(false);
    //   navigate("/roles");
    // });
  };

  return (
    <Flex
      mt={10}
      ml="5%"
      mr="5%"
      p={4}
      borderRadius="md"
      flexDirection="column"
      alignItems="center"
      gap={4}
    >
      <Box width="100%">
        <FormControl isRequired>
          <FormLabel>Name</FormLabel>
          <Input
            isRequired
            placeholder="Role name"
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
          />
        </FormControl>
        <Flex justify="flex-end" mt={4}>
          <Button onClick={handleUpdateRole} colorScheme="blue" isLoading={isSubmitting}>
            Save
          </Button>
        </Flex>
      </Box>
    </Flex>
  );
}
