import React, { useEffect, useState } from "react";
import { Box, Text, CloseButton } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchLinkItems } from "../../app/features/menuSlice";

// Import icons
import { FaUsers } from "react-icons/fa";
import { SlControlEnd } from "react-icons/sl";
import { RiDashboardLine } from "react-icons/ri";
import { BiLogOut } from "react-icons/bi";
import { FaProductHunt } from "react-icons/fa";
import { BiCategoryAlt } from "react-icons/bi";
import { CiShop } from "react-icons/ci";
import { TbRosetteDiscount } from "react-icons/tb";
import { MdOutlineFeaturedPlayList } from "react-icons/md";
import { TfiControlEject } from "react-icons/tfi";


const iconComponents = {
  TfiControlEject,
  FaUsers,
  BiCategoryAlt,
  FaProductHunt,
  CiShop,
  TbRosetteDiscount,
  MdOutlineFeaturedPlayList,
};

const Sidebar = ({ isOpen, onClose }) => {
  const [activeItem, setActiveItem] = useState("Dashboard");

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchLinkItems());
  }, [dispatch]);

  const handleItemClick = (title) => {
    setActiveItem(title);
    onClose();
  };

  const menuItems = useSelector((state) => state.menu.LinkItems);

  const fixedItems = [
    { title: "Dashboard", href: "/dashboard", icon: RiDashboardLine },
    { title: "Signout", href: "/logout", icon: BiLogOut },
  ];

  return (
    <Box
      as="nav"
      position="fixed"
      left="0"
      width={{ base: "xs", md: "250px" }}
      height="100vh"
      display={isOpen ? "block" : { base: "none", md: "block" }}
      zIndex="1000"
      bg="white"
      border="1px solid black"
    >
      {/* Close button on mobile */}
      <CloseButton
        position="absolute"
        display={{ base: "flex", md: "none" }}
        top="10px"
        right="10px"
        fontSize={15}
        onClick={onClose}
      />

      <Box borderBottomWidth="1px" borderColor="gray.700" pb={7} mt={10}>
        <Text fontSize="2xl" fontWeight="bold" textAlign="center" mt={2}>
          Admin Panel
        </Text>
      </Box>

      {/* Render the fixed Dashboard item */}
      <Link to={fixedItems[0].href} style={{ textDecoration: "none" }}>
        <Text
          mb={6}
          mt={6}
          pl={10}
          fontWeight={activeItem === "Dashboard" ? "bold" : "normal"}
          color={activeItem === "Dashboard" ? "blue.400" : "black"}
          cursor="pointer"
          display="flex"
          alignItems="center"
          _hover={{ color: "blue.300" }}
          onClick={() => handleItemClick("Dashboard")}
        >
          <Box as={fixedItems[0].icon} fontSize="20px" mr={4} />
          <span>Dashboard</span>
        </Text>
      </Link>

      {/* Render dynamic menu items */}
      {menuItems.map((item, index) => {
        const IconComponent = iconComponents[item.iconName];
        return (
          <Link to={item.href} key={index} style={{ textDecoration: "none" }}>
            <Text
              mb={6}
              mt={6}
              pl={10}
              fontWeight={activeItem === item.title ? "bold" : "normal"}
              color={activeItem === item.title ? "blue.400" : "black"}
              cursor="pointer"
              display="flex"
              alignItems="center"
              _hover={{ color: "blue.300" }}
              onClick={() => handleItemClick(item.title)}
            >
              <Box as={IconComponent} fontSize="20px" mr={4} />
              <span>{item.title}</span>
            </Text>
          </Link>
        );
      })}

      {/* Render the fixed Signout item */}
      <Link to={fixedItems[1].href} style={{ textDecoration: "none" }}>
        <Text
          mb={6}
          mt={6}
          pl={10}
          fontWeight={activeItem === "Signout" ? "bold" : "normal"}
          color={activeItem === "Signout" ? "blue.400" : "black"}
          cursor="pointer"
          display="flex"
          alignItems="center"
          _hover={{ color: "blue.300" }}
          onClick={() => handleItemClick("Signout")}
        >
          <Box as={fixedItems[1].icon} fontSize="20px" mr={4} />
          <span>Signout</span>
        </Text>
      </Link>
    </Box>
  );
};

export default Sidebar;
