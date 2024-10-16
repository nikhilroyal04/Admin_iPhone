import React, { useState, useEffect } from "react";
import {
  GridItem,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Checkbox,
  IconButton,
  Flex,
  Box,
  CloseButton,
} from "@chakra-ui/react";
import { MdArrowDropDown } from "react-icons/md";

const Payment = ({ formData, setFormData, isEditing, paymentMethods }) => {
  const initialSelectedMethods = formData.applicable || [];
  const [selectedMethods, setSelectedMethods] = useState(
    initialSelectedMethods
  );
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setFormData({
      ...formData,
      applicable: selectedMethods,
    });
  }, [selectedMethods, setFormData]);

  const toggleMethodSelection = (method) => {
    if (isSelected(method)) {
      setSelectedMethods(
        selectedMethods.filter((selectedMethod) => selectedMethod !== method)
      );
    } else {
      setSelectedMethods([...selectedMethods, method]);
    }
  };

  const isSelected = (method) => {
    return selectedMethods.includes(method);
  };

  const handleMenuToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen && isEditing) {
      setSelectedMethods(initialSelectedMethods);
    }
  };

  const removeMethod = (method) => {
    setSelectedMethods(
      selectedMethods.filter((selectedMethod) => selectedMethod !== method)
    );
  };

  return (
    <GridItem colSpan={2}>
      <Text mb={2} fontWeight="bold">
        Applicable Payment Methods
      </Text>

      <Flex flexDirection="column" alignItems="flex-start">
        <Menu isOpen={isOpen && isEditing} onClose={() => setIsOpen(false)}>
          <MenuButton
            as={IconButton}
            icon={
              <Text m={5} display="flex">
                Select Methods{" "}
                <MdArrowDropDown style={{ marginLeft: "5px" }} size={25} />
              </Text>
            }
            variant="outline"
            size="md"
            aria-label="Select payment methods"
            maxWidth={200}
            isDisabled={!isEditing}
            onClick={handleMenuToggle}
          >
            Select Methods
          </MenuButton>
          <MenuList minWidth="240px">
            {paymentMethods.map((method) => (
              <MenuItem key={method}>
                <Checkbox
                  mr={2}
                  isChecked={isSelected(method)}
                  onChange={() => toggleMethodSelection(method)}
                  isDisabled={!isEditing}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  {method}
                </Checkbox>
              </MenuItem>
            ))}
          </MenuList>
        </Menu>

        <Box
          border="1px solid"
          borderColor="gray.300"
          p={3}
          borderRadius="md"
          mt={3}
          width="100%"
        >
          <Flex flexWrap="wrap" mt={1}>
            {selectedMethods.map((method) => (
              <Flex
                key={method}
                alignItems="center"
                mr={2}
                mb={2}
                bg="gray.100"
                p={2}
                borderRadius="md"
              >
                <Text>{method}</Text>
                {isEditing && (
                  <CloseButton ml={2} onClick={() => removeMethod(method)} />
                )}
              </Flex>
            ))}
          </Flex>
        </Box>
      </Flex>
    </GridItem>
  );
};

export default Payment;
