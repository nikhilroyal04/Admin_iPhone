import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Text,
  Badge,
  VStack,
  Box,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import TimeConversion from "../../utils/timeConversion";

const ViewOrder = ({ isOpen, onClose, order }) => {
  if (!order) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent maxW={{ base: "90%", md: "800px" }}>
        <ModalHeader>Order Details</ModalHeader>
        <ModalBody>
          <VStack spacing={4} align="start">
            {/* Order Information */}
            <Grid
              templateColumns={{ base: "1fr", md: "1fr 1fr" }}
              gap={4}
              width="full"
            >
              <GridItem>
                <Text fontWeight="bold">Order ID:</Text>
                <Text>{order._id}</Text> {/* Order ID */}
              </GridItem>
              <GridItem>
                <Text fontWeight="bold">User ID:</Text>
                <Text>{order.userId}</Text>
              </GridItem>
              <GridItem>
                <Text fontWeight="bold">Product ID:</Text>
                <Text>{order.productId}</Text>
              </GridItem>
              <GridItem>
                <Text fontWeight="bold">Product Name:</Text>
                <Text>{order.productName}</Text>
              </GridItem>
              <GridItem>
                <Text fontWeight="bold">Quantity:</Text>
                <Text>{order.quantity}</Text>
              </GridItem>
              <GridItem>
                <Text fontWeight="bold">Total Amount:</Text>
                <Text>${order.totalPaidAmount}</Text>
              </GridItem>
              <GridItem>
                <Text fontWeight="bold">Delivery Fee:</Text>
                <Text>
                  {order.deliveryFee === "NA" ? "N/A" : `$${order.deliveryFee}`}
                </Text>
              </GridItem>
              <GridItem>
                <Text fontWeight="bold">Discount Applied:</Text>
                <Text>{order.couponApplied}</Text>
              </GridItem>

              <GridItem>
                <Text fontWeight="bold">Order Date:</Text>
                <Text>
                  {TimeConversion.unixTimeToRealTime(order.createdOn)}
                </Text>
              </GridItem>
              <GridItem>
                <Text fontWeight="bold">Coupon Code:</Text>
                <Text>{order.code}</Text>
              </GridItem>

              <GridItem>
                <Text fontWeight="bold">Order Status:</Text>
                <Badge
                  colorScheme={
                    order.orderStatus === "Pending" ? "orange" : "green"
                  }
                >
                  {order.orderStatus}
                </Badge>
              </GridItem>
              <GridItem>
                <Text fontWeight="bold">Created On:</Text>
                <Text>
                  {TimeConversion.unixTimeToRealTime(order.createdOn)}
                </Text>
              </GridItem>
              <GridItem>
                <Text fontWeight="bold">Updated On:</Text>
                <Text>
                  {TimeConversion.unixTimeToRealTime(order.updatedOn)}
                </Text>
              </GridItem>
              <GridItem></GridItem>
              <GridItem>
                <Text fontWeight="bold">Billing Address:</Text>
                <Box borderWidth={1} borderRadius="md" p={2} bg="gray.50">
                  <Text fontWeight="bold">{order.billingAddress.name}</Text>
                  <Text>{order.billingAddress.phoneNumber}</Text>
                  <Text>{order.billingAddress.email}</Text>
                  <Text>{order.billingAddress.addressLine1}</Text>
                  <Text>{order.billingAddress.locality}</Text>
                  {/* Add more fields from billingAddress if available */}
                </Box>
              </GridItem>
              <GridItem>
                <Text fontWeight="bold">Shipping Address:</Text>
                <Box borderWidth={1} borderRadius="md" p={2} bg="gray.50">
                  <Text fontWeight="bold">{order.shippingAddress.name}</Text>
                  <Text>{order.shippingAddress.phoneNumber}</Text>
                  <Text>{order.shippingAddress.email}</Text>
                  <Text>{order.shippingAddress.addressLine1}</Text>
                  <Text>{order.shippingAddress.locality}</Text>
                  {/* Add more fields from shippingAddress if available */}
                </Box>
              </GridItem>
            </Grid>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ViewOrder;
