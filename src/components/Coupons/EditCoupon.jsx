import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Button,
  Input,
  Textarea,
  FormControl,
  FormLabel,
  useToast,
  Grid,
  GridItem,
  Select,
} from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { editCoupon } from "../../app/features/couponSlice";
import Payment from "./Payment";
import TimeConversion from "../../utils/timeConversion";

const EditCoupon = ({ coupon, isOpen, onClose }) => {
  const dispatch = useDispatch();
  const toast = useToast();
  const [formData, setFormData] = useState({
    code: "",
    shortDescription: "",
    longDescription: "",
    applicable: [],
    discountType: "flat",
    discountValue: "",
    minimumPurchase: "",
    expiryDate: "",
    maxRedemptions: "",
    currentRedemptions: 0,
    status: "Active",
  });
  const [isLoading, setIsLoading] = useState(false);

  // Populate form fields with existing coupon data
  useEffect(() => {
    if (coupon) {
      setFormData({
        code: coupon.code,
        shortDescription: coupon.shortDescription,
        longDescription: coupon.longDescription,
        applicable: coupon.applicable || [],
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        minimumPurchase: coupon.minimumPurchase,
        expiryDate: coupon.expiryDate,
        maxRedemptions: coupon.maxRedemptions,
        currentRedemptions: coupon.currentRedemptions || 0,
        status: coupon.status || "Active",
      });
    }
  }, [coupon]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditCoupon = async (e) => {
    e.preventDefault();

    const couponData = {
      ...formData,
    };

    setIsLoading(true);
    try {
      await dispatch(editCoupon(coupon._id, couponData)); // Adjust based on your actual action
      toast({
        title: "Coupon Updated.",
        description: "The coupon has been successfully updated.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error.",
        description: "There was an error updating the coupon.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent maxW={{ base: "90%", md: "800px" }}>
        <ModalHeader>Edit Coupon</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleEditCoupon}>
            <Grid
              templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
              gap={4}
            >
              <GridItem>
                <FormControl isRequired>
                  <FormLabel>Code</FormLabel>
                  <Input
                    name="code"
                    placeholder="Coupon Code"
                    value={formData.code}
                    onChange={handleChange}
                    required
                  />
                </FormControl>
              </GridItem>

              <GridItem>
                <FormControl isRequired>
                  <FormLabel>Short Description</FormLabel>
                  <Input
                    name="shortDescription"
                    placeholder="Short Description"
                    value={formData.shortDescription}
                    onChange={handleChange}
                    required
                  />
                </FormControl>
              </GridItem>

              <GridItem colSpan={{ base: 1, md: 2 }}>
                <FormControl isRequired>
                  <FormLabel>Long Description</FormLabel>
                  <Textarea
                    name="longDescription"
                    placeholder="Detailed Description"
                    value={formData.longDescription}
                    onChange={handleChange}
                    required
                  />
                </FormControl>
              </GridItem>

              {/* Multi-select dropdown */}
              <GridItem>
                <Payment
                  formData={coupon}
                  setFormData={setFormData}
                  isEditing={true}
                  paymentMethods={[
                    "UPI",
                    "Credit Card",
                    "Debit Card",
                    "Net Banking",
                  ]}
                />
              </GridItem>

              <GridItem>
                <FormControl isRequired>
                  <FormLabel>Discount Type</FormLabel>
                  <Select
                    name="discountType"
                    value={formData.discountType}
                    onChange={handleChange}
                    required
                  >
                    <option value="flat">Flat</option>
                    <option value="percentage">Percentage</option>
                  </Select>
                </FormControl>
              </GridItem>

              <GridItem>
                <FormControl isRequired>
                  <FormLabel>Discount Value</FormLabel>
                  <Input
                    name="discountValue"
                    type="number"
                    placeholder="Discount Value"
                    value={formData.discountValue}
                    onChange={handleChange}
                    required
                  />
                </FormControl>
              </GridItem>

              <GridItem>
                <FormControl isRequired>
                  <FormLabel>Minimum Purchase</FormLabel>
                  <Input
                    name="minimumPurchase"
                    type="number"
                    placeholder="Minimum Purchase Amount"
                    value={formData.minimumPurchase}
                    onChange={handleChange}
                    required
                  />
                </FormControl>
              </GridItem>

              <GridItem>
                <FormControl isRequired>
                  <FormLabel>Expiry Date</FormLabel>
                  {/* Change this input to text type and make it read-only */}
                  <Input
                    name="expiryDate"
                    type="text"
                    value={TimeConversion.unixTimeToRealTime(
                      formData.expiryDate
                    )}
                    readOnly
                  />
                </FormControl>
              </GridItem>

              <GridItem>
                <FormControl isRequired>
                  <FormLabel>Max Redemptions</FormLabel>
                  <Input
                    name="maxRedemptions"
                    type="number"
                    placeholder="Max Redemptions"
                    value={formData.maxRedemptions}
                    onChange={handleChange}
                    required
                  />
                </FormControl>
              </GridItem>
            </Grid>

            <Button
              colorScheme="blue"
              type="submit"
              isLoading={isLoading}
              loadingText="Updating..."
              mt={4}
              mb={2}
              width="full"
            >
              Update Coupon
            </Button>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default EditCoupon;
