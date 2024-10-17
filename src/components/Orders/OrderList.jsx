import React, { useEffect, useState } from "react";
import {
  Box,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Heading,
  Badge,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchOrderData,
  selectOrderData,
  selectOrderError,
  selectOrderLoading,
} from "../../app/features/orderSlice";
import Loader from "../Not_Found/Loader";
import Error502 from "../Not_Found/Error502";
import TimeConversion from "../../utils/timeConversion";
import EditOrder from "./EditOrder"; // Import your EditOrder component
import ViewOrder from "./ViewOrder"; // Import the ViewOrderModal component

export default function OrderList() {
  const dispatch = useDispatch();
  const {
    isOpen: isViewOpen,
    onOpen: onViewOpen,
    onClose: onViewClose,
  } = useDisclosure();
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Selectors to get order data, loading state, and error state from the Redux store
  const orderData = useSelector(selectOrderData);
  const isLoading = useSelector(selectOrderLoading);
  const error = useSelector(selectOrderError);

  // Fetch order data when the component mounts
  useEffect(() => {
    dispatch(fetchOrderData());
  }, [dispatch]);

  if (isLoading) {
    return <Loader />;
  }

  // Render error message if there is an error
  if (error) {
    return <Error502 />;
  }

  const handleViewClick = (order) => {
    setSelectedOrder(order);
    onViewOpen();
  };

  const handleEditClick = (order) => {
    setSelectedOrder(order);
    onEditOpen();
  };

  return (
    <>
      <Box p={4} overflow="auto">
        <Heading as="h2" size="lg" mb={6}>
          Order List
        </Heading>

        <Table variant="striped" colorScheme="gray" overflow="auto">
          <Thead>
            <Tr>
              <Th>Order ID</Th>
              <Th>Product Name</Th>
              <Th>Order Date</Th>
              <Th>Product Id</Th>
              <Th>Status</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody overflow="auto">
            {orderData.length > 0 ? (
              orderData.map((order) => (
                <Tr key={order._id}>
                  <Td
                    onClick={() => handleViewClick(order)}
                    style={{ cursor: "pointer" }}
                  >
                    {order._id}
                  </Td>
                  <Td>{order.productName}</Td>
                  <Td>{TimeConversion.unixTimeToRealTime(order.createdOn)}</Td>
                  <Td>{order.productId}</Td>
                  <Td>
                    <Badge
                      colorScheme={
                        order.orderStatus === "Pending" ? "orange" : "green"
                      }
                    >
                      {order.orderStatus}
                    </Badge>
                  </Td>
                  <Td>
                    <Button
                      colorScheme="blue"
                      onClick={() => handleEditClick(order)}
                      size="sm"
                    >
                      Edit
                    </Button>
                  </Td>
                </Tr>
              ))
            ) : (
              <Tr>
                <Td colSpan={6}>
                  <Text>No orders found.</Text>
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>

        {/* Use the ViewOrderModal component for viewing order details */}
        <ViewOrder
          isOpen={isViewOpen}
          onClose={onViewClose}
          order={selectedOrder}
        />

        {/* Edit Order Modal */}
        {selectedOrder && (
          <EditOrder
            isOpen={isEditOpen}
            onClose={onEditClose}
            orderData={selectedOrder}
          />
        )}
      </Box>
    </>
  );
}
