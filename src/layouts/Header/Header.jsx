import { Box, Text, IconButton, Avatar } from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";

const Header = ({ onOpen, isMenuOpen }) => {
  return (
    <Box
      mt={6}
      // borderRadius={50}
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

      <Text fontSize="2xl" color="black" fontWeight="600" flex="1" ml={2}>
        Dashboard
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
