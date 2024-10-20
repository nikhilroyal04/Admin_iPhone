import React, { useEffect, useState } from "react";
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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Flex,
  Select,
} from "@chakra-ui/react";
import {
  selectCouponData,
  selectCouponError,
  selectCouponLoading,
  fetchCouponData,
  removeCoupon,
} from "../../app/features/couponSlice";
import AddCoupon from "./AddCoupon";
import EditCoupon from "./EditCoupon";
import TimeConversion from "../../utils/timeConversion";
import Loader from "../Not_Found/Loader";
import Error502 from "../Not_Found/Error502";

export default function Coupons() {
  const dispatch = useDispatch();
  const {
    isOpen: isAddOpen,
    onOpen: onAddOpen,
    onClose: onAddClose,
  } = useDisclosure();
  const {
    isOpen: isDetailsOpen,
    onOpen: onDetailsOpen,
    onClose: onDetailsClose,
  } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();

  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [couponToDelete, setCouponToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [filterStatus, setFilterStatus] = useState("");

  const couponData = useSelector(selectCouponData);
  const isLoading = useSelector(selectCouponLoading);
  const error = useSelector(selectCouponError);

  useEffect(() => {
    dispatch(fetchCouponData());
  }, [dispatch]);

  const filteredCoupons = filterStatus
    ? couponData.filter((coupon) => coupon.status === filterStatus)
    : couponData;

  if (isLoading) {
    return <Loader />;
  }

  // Render error message if there is an error
  if (error) {
    return <Error502 />;
  }

  const handleDelete = () => {
    if (couponToDelete) {
      setIsDeleting(true);
      dispatch(removeCoupon(couponToDelete))
        .then(() => {
          setCouponToDelete(null);
          setIsDeleting(false);
          onDeleteClose();
        })
        .catch(() => {
          setIsDeleting(false);
        });
    }
  };

  const handleEdit = (coupon) => {
    setSelectedCoupon(coupon);
    onEditOpen(); // Open edit modal
  };

  const handleViewDetails = (coupon) => {
    setSelectedCoupon(coupon); // Set selected coupon
    onDetailsOpen(); // Open details modal
  };

  return (
    <Box p={4} overflow="auto">
      <Flex justify="space-between" align="center" mb={4} flexWrap="wrap">
        <Text as="h2" fontSize="2xl">
          Coupons
        </Text>
        <Flex spacing={4}>
          <Select
            placeholder="Filter by status"
            onChange={(e) => setFilterStatus(e.target.value)}
            width="65%"
            mr={2}
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </Select>
          <Button colorScheme="teal" onClick={onAddOpen}>
            Add Coupon
          </Button>
        </Flex>
      </Flex>
      <Table variant="simple" overflow="auto">
        <Thead>
          <Tr>
            <Th>Code</Th>
            <Th>Type</Th>
            <Th>Discount</Th>
            <Th>Used</Th>
            <Th>Limit</Th>
            <Th>Expiry Date</Th>
            <Th>Status</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filteredCoupons && filteredCoupons.length > 0 ? (
            filteredCoupons.map((coupon) => (
              <Tr key={coupon._id} cursor="pointer" _hover={{ bg: "gray.100" }}>
                <Td
                  onClick={() => handleViewDetails(coupon)} // Handle view details
                  textDecoration="underline"
                  _hover={{ color: "blue" }}
                >
                  {coupon.code}
                </Td>
                <Td>{coupon.discountType}</Td>
                <Td>{coupon.discountValue}</Td>
                <Td>{coupon.currentRedemptions}</Td>
                <Td>{coupon.maxRedemptions}</Td>
                <Td>{TimeConversion.unixTimeToRealTime(coupon.expiryDate)}</Td>
                <Td>
                  <Badge
                    colorScheme={coupon.status === "Active" ? "green" : "red"}
                    borderRadius="full"
                    px={3}
                    py={1}
                  >
                    {coupon.status}
                  </Badge>
                </Td>
                <Td>
                  <Flex>
                    <Button
                      colorScheme="blue"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(coupon); // Open edit modal
                      }}
                      mr={2}
                    >
                      Edit
                    </Button>
                    <Button
                      colorScheme="red"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCouponToDelete(coupon._id);
                        onDeleteOpen(); // Open delete confirmation modal
                      }}
                    >
                      Delete
                    </Button>
                  </Flex>
                </Td>
              </Tr>
            ))
          ) : (
            <Tr>
              <Td colSpan={8} textAlign="center">
                No coupons found.
              </Td>
            </Tr>
          )}
        </Tbody>
      </Table>

      {/* Modal for displaying coupon details */}
      <Modal isOpen={isDetailsOpen} onClose={onDetailsClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Coupon Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedCoupon && (
              <Box>
                <Text fontWeight="bold">Code:</Text>
                <Text>{selectedCoupon.code}</Text>

                <Text fontWeight="bold">Discount Value:</Text>
                <Text>{selectedCoupon.discountValue}%</Text>

                <Text fontWeight="bold">Discount Type:</Text>
                <Text>{selectedCoupon.discountType}</Text>

                <Text fontWeight="bold">Created On:</Text>
                <Text>
                  {new Date(
                    parseInt(selectedCoupon.createdOn)
                  ).toLocaleString()}
                </Text>

                <Text fontWeight="bold">Expiry Date:</Text>
                <Text>
                  {TimeConversion.unixTimeToRealTime(selectedCoupon.expiryDate)}
                </Text>

                <Text fontWeight="bold">Status:</Text>
                <Text>{selectedCoupon.status}</Text>

                <Text fontWeight="bold">Short Description:</Text>
                <Text>{selectedCoupon.shortDescription}</Text>

                <Text fontWeight="bold">Long Description:</Text>
                <Text>{selectedCoupon.longDescription}</Text>

                <Text fontWeight="bold">Applicable Payment Methods:</Text>
                <Text>{selectedCoupon.applicable.join(", ")}</Text>

                <Text fontWeight="bold">Minimum Purchase:</Text>
                <Text>${selectedCoupon.minimumPurchase}</Text>

                <Text fontWeight="bold">Current Redemptions:</Text>
                <Text>{selectedCoupon.currentRedemptions}</Text>

                <Text fontWeight="bold">Max Redemptions:</Text>
                <Text>{selectedCoupon.maxRedemptions}</Text>
              </Box>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={onDetailsClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Deletion</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Are you sure you want to delete this coupon?</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={onDeleteClose}>
              Cancel
            </Button>
            <Button
              colorScheme="red"
              onClick={handleDelete}
              ml={3}
              isLoading={isDeleting}
              loadingText="Deleting..."
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Add Coupon Modal */}
      <AddCoupon isOpen={isAddOpen} onClose={onAddClose} />

      {/* Edit Coupon Modal */}
      <EditCoupon
        coupon={selectedCoupon}
        isOpen={isEditOpen}
        onClose={onEditClose}
      />
    </Box>
  );
}
