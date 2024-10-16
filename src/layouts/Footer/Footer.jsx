import React from 'react';
import {
  Box,
  Flex,
  Text,
  Link,
  Divider,
  Icon,
} from '@chakra-ui/react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <Box
      color="black"
      py={6}
      px={{ base: 4, md: 8 }}
      mt={8}
    >
      <Divider borderColor="gray.600" />

      <Flex
        direction={{ base: 'column', md: 'row' }}
        align={{ md: 'center' }}
        justify="space-between"
        mt={6}
      >
        <Text fontSize="sm">
          &copy; {new Date().getFullYear()} Guru iPhone. All rights reserved.
        </Text>

        <Flex mt={{ base: 4, md: 0 }} justify="space-between" width={{ base: '100%', md: 'auto' }}>
          <Link href="#" isExternal>
            <Icon as={FaFacebook} boxSize={5} mr={2} />
          </Link>
          <Link href="#" isExternal>
            <Icon as={FaTwitter} boxSize={5} mr={2} />
          </Link>
          <Link href="#" isExternal>
            <Icon as={FaInstagram} boxSize={5} mr={2} />
          </Link>
          <Link href="#" isExternal>
            <Icon as={FaLinkedin} boxSize={5} mr={2} />
          </Link>
        </Flex>
      </Flex>

      <Flex
        direction={{ base: 'column', md: 'row' }}
        justify="center"
        mt={4}
        fontSize="sm"
      >
        <Link href="/about" mx={2}>About Us</Link>
        <Link href="/contact" mx={2}>Contact</Link>
        <Link href="/privacy" mx={2}>Privacy Policy</Link>
        <Link href="/terms" mx={2}>Terms of Service</Link>
      </Flex>
    </Box>
  );
};

export default Footer;
