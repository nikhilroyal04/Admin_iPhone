import { Box, useDisclosure } from "@chakra-ui/react";
import Header from "./Header/Header";
import Sidebar from "./Sidebar/Sidebar";
import Footer from "./Footer/Footer";
import { Outlet } from "react-router-dom";

const FullLayout = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Header onOpen={onOpen} />
      <Sidebar isOpen={isOpen} onClose={onClose} />
      <Box
        ml={{ base: 0, md: "250px" }}
        pt="110px"
        pl={8}
        pr={8}
        minHeight="100vh"
      >
        <Outlet />
      </Box>
      <Box ml={{ base: 0, md: "250px" }}>
        <Footer />
      </Box>
    </>
  );
};

export default FullLayout;
