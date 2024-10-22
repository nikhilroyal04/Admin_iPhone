import React from "react";
import { Box, Text, IconButton, Avatar } from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { useLocation, useNavigate } from "react-router-dom";

const Header = ({ onOpen, isMenuOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Function to get the current heading and navigation path based on the URL
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

      // Add more cases as needed
      default:
        return { heading: "Dashboard", subHeadings: [] };
    }
  };

  const handleHeaderClick = (segment) => {
    const path = `/${segment.toLowerCase()}`; // Build path for navigation
    navigate(path); // Navigate to the selected segment
  };

  const { heading, subHeadings } = getHeaderDetails();

  return (
    <Box
      mt={6}
      as="header"
      width={{ base: "100%", md: "calc(100% - 250px)" }}
      ml={{ base: 0, md: "250px" }}
      height="80px"
      p={4}
      display="flex"
      alignItems="center"
      bg="aliceblue"
      position="fixed"
      top="0"
      zIndex="999"
      borderColor="gray.200"
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

      <Text
        fontSize="2xl"
        color="black"
        fontWeight="600"
        flex="1"
        ml={2}
        display="flex"
        alignItems="center"
      >
        {heading}

        {subHeadings.length > 0 && (
          <Box display="flex" ml={4}>
            {subHeadings.map((subHeading, index) => (
              <React.Fragment key={subHeading}>
                <Text
                  fontSize="2xl"
                  color="black"
                  fontWeight="500"
                  cursor="pointer"
                  onClick={() => handleHeaderClick(subHeading.split(" > ")[0])} // Navigate to the clicked heading
                  mr={index < subHeadings.length - 1 ? 2 : 0} // Add margin between headings
                >
                  {">  "}
                  {subHeading.split(" > ")[1] || subHeading}
                </Text>
              </React.Fragment>
            ))}
          </Box>
        )}
      </Text>

      {/* Hide "Welcome User" text on small screens */}
      <Text
        display={{ base: "none", md: "block" }}
        ml={3}
        mr={6}
        fontSize="xl"
        fontWeight="500"
        color="black"
      >
        Welcome User
      </Text>

      <Box display="flex" alignItems="center" ml="auto">
        <Avatar
          src="https://bit.ly/dan-abramov"
          size="md"
          aria-label="User profile"
        />
      </Box>
    </Box>
  );
};

export default Header;
