import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  useToast,
} from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { editOrder } from "../../app/features/orderSlice";

const EditOrder = ({ isOpen, onClose, orderData }) => {
  const dispatch = useDispatch();
  const toast = useToast(); // Initialize toast
  const [formData, setFormData] = useState(orderData);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (orderData) {
      setFormData(orderData); // Set initial form data from orderData prop
    }
  }, [orderData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Dispatch the edit action with the order ID and updated data
      await dispatch(editOrder(formData._id, formData));

      // Show success toast
      toast({
        title: "Order updated.",
        description: "The order has been successfully updated.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      onClose();
    } catch (error) {
      // Show error toast
      toast({
        title: "Error updating order.",
        description: "There was an error while updating the order.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Order</ModalHeader>
        <ModalBody>
          {/* Read-only fields */}
          <FormControl mb={4}>
            <FormLabel>User ID</FormLabel>
            <Input value={formData.userId} readOnly bg="gray.100" />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Product ID</FormLabel>
            <Input value={formData.productId} readOnly bg="gray.100" />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Product Name</FormLabel>
            <Input value={formData.productName} readOnly bg="gray.100" />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Order Date</FormLabel>
            <Input value={formData.createdOn} readOnly bg="gray.100" />
          </FormControl>

          {/* Order Status Select */}
          <FormControl mb={4}>
            <FormLabel>Status</FormLabel>
            <Select
              name="orderStatus"
              value={formData.orderStatus}
              onChange={handleChange}
            >
              <option value="Pending">Pending</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Returned">Returned</option>
              <option value="Refunded">Refunded</option>
            </Select>
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="blue"
            onClick={handleSubmit}
            isLoading={loading} // Show loading spinner on button
            loadingText="Saving"
          >
            Save
          </Button>
          <Button ml={3} onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditOrder;
