import React, { useEffect } from "react";
import {
  Box,
  Text,
  Spinner,
  Alert,
  AlertIcon,
  SimpleGrid,
  Heading,
  Badge,
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

export default function OrderList() {
  const dispatch = useDispatch();

  // Selectors to get order data, loading state, and error state from the Redux store
  // const orders = useSelector(selectOrderData);
  const isLoading = useSelector(selectOrderLoading);
  const error = useSelector(selectOrderError);

  const orders = [
    {
      id: 1,
      createdOn: 1672527600000, // Example timestamp
      status: "Shipped",
      totalAmount: 59.99,
      paymentMethod: "Credit Card",
      items: [
        { productId: "p1", productName: "iPhone 12", quantity: 1 },
        { productId: "p2", productName: "AirPods", quantity: 2 },
      ],
    },
    // Add more orders as necessary
  ];
  

  // Fetch order data when the component mounts
  useEffect(() => {
    // dispatch(fetchOrderData());
  }, [dispatch]);

  if (isLoading) {
    return <Loader />;
  }

  // Render error message if there is an error
  if (error) {
    return <Error502 />;
  }

  return (
    <Box p={4}>
      <Heading as="h2" size="lg" mb={6}>
        Order List
      </Heading>
      <SimpleGrid columns={[1, 2, 3]} spacing={4}>
        {orders.length > 0 ? (
          orders.map((order) => (
            <Box
              key={order.id} // Ensure to use a unique id
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
              boxShadow="lg"
              p={4}
              textAlign="left"
            >
              <Text fontWeight="bold">Order ID: {order.id}</Text>
              <Text>Date: {new Date(order.createdOn).toLocaleDateString()}</Text>
              <Text>Status: <Badge colorScheme={order.status === "Shipped" ? "green" : "orange"}>{order.status}</Badge></Text>
              <Text>Total Amount: ${order.totalAmount}</Text>
              <Text>Payment Method: {order.paymentMethod}</Text>
              <Text>Items:</Text>
              <SimpleGrid columns={1} spacing={2} pl={4}>
                {order.items.map((item) => (
                  <Text key={item.productId}>
                    - {item.productName} (Quantity: {item.quantity})
                  </Text>
                ))}
              </SimpleGrid>
            </Box>
          ))
        ) : (
          <Text>No orders found.</Text>
        )}
      </SimpleGrid>
    </Box>
  );
}
