import React, { useState } from "react";
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
import { addCoupon } from "../../app/features/couponSlice";
import Payment from "./Payment";
import TimeConversion from "../../utils/timeConversion";

const AddCoupon = ({ isOpen, onClose }) => {
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddCoupon = async (e) => {
    e.preventDefault();

    const expiryDateUnix = TimeConversion.realTimeToUnixTime(
      formData.expiryDate
    );

    const couponData = {
      ...formData,
      expiryDate: expiryDateUnix,
    };

    setIsLoading(true);
    try {
      await dispatch(addCoupon(couponData));
      toast({
        title: "Coupon Added.",
        description: "The coupon has been successfully added.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setFormData({
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
      onClose();
    } catch (error) {
      toast({
        title: "Error.",
        description: "There was an error adding the coupon.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent maxW={{ base: "90%", md: "800px" }}>
          <ModalHeader>Add Coupon</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleAddCoupon}>
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
                    formData={formData}
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
                    <Input
                      name="expiryDate"
                      type="date"
                      value={formData.expiryDate}
                      onChange={handleChange}
                      required
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
                loadingText="Adding..."
                mt={4}
                mb={2}
                width="full"
              >
                Add Coupon
              </Button>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddCoupon;
