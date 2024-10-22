import React, { useEffect } from "react";
import { Box, Text, IconButton, Avatar, Flex } from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { selectUser } from "../../app/features/authSlice";
import { useSelector } from "react-redux";

const Header = ({ onOpen, isMenuOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const user = useSelector(selectUser);

  const getHeaderDetails = () => {
    const path = location.pathname;

    switch (true) {
      case path === "/dashboard":
        return { heading: "Dashboard", subHeadings: [] };

      case path === "/products":
        return { heading: "Dashboard", subHeadings: ["Products"] };

      case path === "/products/addproduct":
        return {
          heading: "Dashboard",
          subHeadings: ["Products > Products "],
        };

      case path.startsWith("/products/editproduct"):
        return {
          heading: "Dashboard",
          subHeadings: ["Products > Products"],
        };

      case path === "/users":
        return { heading: "Dashboard", subHeadings: ["Users"] };

      case path === "/categories":
        return { heading: "Dashboard", subHeadings: ["Categories"] };

      case path === "/coupons":
        return { heading: "Dashboard", subHeadings: ["Coupons"] };

      case path === "/orders":
        return { heading: "Dashboard", subHeadings: ["Orders"] };

      case path === "/roles":
        return { heading: "Dashboard", subHeadings: ["Roles"] };

      case path.startsWith("/roles/editrole/"):
        return {
          heading: "Dashboard",
          subHeadings: ["Roles > Roles"],
        };

      case path.startsWith("/features/editFeature/"):
        return {
          heading: "Dashboard",
          subHeadings: ["Features > Features"],
        };

      case path === "/features/addFeature":
        return {
          heading: "Dashboard",
          subHeadings: ["Features > Features"],
        };

      case path === "/features":
        return { heading: "Dashboard", subHeadings: ["Features"] };

      default:
        return { heading: "Dashboard", subHeadings: [] };
    }
  };

  const handleHeaderClick = (segment) => {
    const path = `/${segment.toLowerCase()}`;
    navigate(path);
  };

  const { heading, subHeadings } = getHeaderDetails();

  if (!user) {
    // user not found logic
  }

  return (
    <Box
      mt={6}
      as="header"
      width={{ base: "100%", md: "calc(100% - 250px)" }}
      ml={{ base: 0, md: "250px" }}
      height="80px"
      p={4}
      display="flex"
      flexDirection={{ base: "column", md: "row" }}
      alignItems={{ base: "flex-start", md: "center" }}
      bg="aliceblue"
      position="fixed"
      top="0"
      zIndex="999"
      borderColor="gray.200"
      flexWrap="wrap"
    >
      <Flex
        direction="row"
        width="100%"
        alignItems="center"
        justifyContent="space-between"
      >
        <IconButton
          icon={<HamburgerIcon fontSize={26} />}
          display={{ base: "inline-flex", md: "none" }}
          onClick={onOpen}
          aria-label="Open menu"
          aria-expanded={isMenuOpen}
          aria-controls="menu"
          mr={4}
          bg="none"
          color="black"
          variant="none"
        />
        <Flex
          flexDirection={{ base: "column", sm: "row" }}
          justifyContent={{ base: "flex-start" }}
          flex="1"
          ml={2}
        >
          <Text
            fontSize={{ base: "lg", sm: "xl", md: "xl", lg: "2xl" }}
            color="black"
            fontWeight="600"
          >
            {heading}
          </Text>

          {subHeadings.length > 0 && (
            <Box
              display="flex"
              ml={{ base: 0, sm: 4 }}
              flexDirection={{ base: "column", sm: "row" }}
              flexWrap="wrap"
            >
              {subHeadings.map((subHeading, index) => (
                <React.Fragment key={subHeading}>
                  <Text
                    fontSize={{ base: "lg", sm: "xl", md: "xl", lg: "2xl" }}
                    color="black"
                    fontWeight="500"
                    cursor="pointer"
                    onClick={() =>
                      handleHeaderClick(subHeading.split(" > ")[0])
                    }
                    mr={index < subHeadings.length - 1 ? 2 : 0}
                    mb={{ base: 2, sm: 0 }}
                  >
                    {">  "}
                    {subHeading.split(" > ")[1] || subHeading}
                  </Text>
                </React.Fragment>
              ))}
            </Box>
          )}
        </Flex>
        <Text
          display={{ base: "none", md: "block" }}
          ml={3}
          mr={6}
          fontSize="xl"
          fontWeight="500"
          color="black"
        >
          {user ? `Welcome ${user.name}` : "Welcome User"}
        </Text>
        <Avatar
          src="https://bit.ly/dan-abramov"
          size="md"
          aria-label="User profile"
        />
      </Flex>
    </Box>
  );
};

export default Header;
