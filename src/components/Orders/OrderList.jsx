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
  Flex,
  Badge,
  Button,
  useDisclosure,
  HStack,
  Input,
  Select,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchOrderData,
  selectOrderData,
  selectOrderError,
  selectOrderLoading,
  selectTotalPages,
} from "../../app/features/orderSlice";
import Loader from "../Not_Found/Loader";
import Error502 from "../Not_Found/Error502";
import TimeConversion from "../../utils/timeConversion";
import EditOrder from "./EditOrder";
import ViewOrder from "./ViewOrder";

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
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // Selectors to get order data, loading state, and error state from the Redux store
  const orderData = useSelector(selectOrderData);
  const totalPages = useSelector(selectTotalPages);
  const isLoading = useSelector(selectOrderLoading);
  const error = useSelector(selectOrderError);

  // Fetch order data when the component mounts
  useEffect(() => {
    dispatch(fetchOrderData(currentPage));
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

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    // Filter orders based on search term
    setFilterStatus(e.target.value);
  };

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

  return (
    <>
      <Box p={4} overflow="auto">
        <Flex justify="space-between" align="center" mb={4} flexWrap="wrap">
          <Text as="h2" fontSize="2xl">
            Order List
          </Text>
          <Flex
            direction={{ base: "column", sm: "row" }}
            justify={{ base: "flex-start", md: "flex-end" }}
            width={{ base: "100%", md: "auto" }}
            mt={{ base: 3, md: 0 }}
          >
            {" "}
            <Input
              placeholder="Search by prod/ord id... "
              value={searchTerm}
              onChange={handleSearchChange}
              mr={2}
              mb={2}
            />
            <Select
              placeholder="Filter by status"
              value={filterStatus}
              onChange={handleFilterChange}
            >
              <option value="Pending">Pending</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Returned">Returned</option>
              <option value="Refunded">Refunded</option>
            </Select>
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
                    <Td>
                      {TimeConversion.unixTimeToRealTime(order.createdOn)}
                    </Td>
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
        </Box>

        <HStack spacing={4} justifyContent="center" mt={6}>
          {renderPaginationButtons()}
        </HStack>

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
