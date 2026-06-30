import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { HiMenu, HiX } from 'react-icons/hi';
import { MdHome, MdTour, MdLocalTaxi, MdEmail, MdLibraryBooks } from 'react-icons/md';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box,
  Flex,
  HStack,
  Button,
  IconButton,
  useDisclosure,
} from '@chakra-ui/react';
import LanguageSwitcher from '../LanguageSwitcher';
import { useBrand } from '../../contexts/BrandContext';

const navItems = [
  { name: 'nav.home', path: '/#top', icon: MdHome },
  { name: 'nav.tours', path: '/tours#top', icon: MdTour },
  { name: 'nav.transport', path: '/transport#top', icon: MdLocalTaxi },
  { name: 'nav.blog', path: '/blog#top', icon: MdLibraryBooks },
  { name: 'nav.contact', path: '/contact#top', icon: MdEmail },
];

const Header: React.FC = () => {
  const { isOpen, onToggle } = useDisclosure();
  const { brandSettings } = useBrand();
  
  const bgColor = 'whiteAlpha.700';
  const borderColor = 'whiteAlpha.500';
  const hoverBg = 'brand.100';
  const textColor = 'gray.800';

  return (
    <Box as="header" position="sticky" top={0} zIndex={50} w="full">
      <Flex
        bg={bgColor}
        backdropFilter="blur(12px)"
        borderBottomWidth="1px"
        borderColor={borderColor}
        boxShadow="0 8px 32px rgba(8,42,62,0.15)"
        px={{ base: 4, md: 8 }}
        py={4}
        align="center"
        justify="space-between"
        maxW="7xl"
        mx="auto"
      >
        {/* Logo */}
        <Link to="/#top">
          <Flex align="center" gap={3}>
            <motion.div
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Box
                position={{ base: 'fixed', lg: 'relative' }}
                left={{ base: 4, lg: 0 }}
                top={{ base: 2, lg: 0 }}
                h={{ base: '6rem', lg: '5rem' }}
                w={{ base: '6rem', lg: '5rem' }}
                borderRadius="full"
                bgGradient="linear(to-br, whiteAlpha.800, cyan.50)"
                boxShadow="0 0 30px rgba(251,146,60,0.95), 0 0 60px rgba(251,146,60,0.6)"
                overflow="hidden"
                display="grid"
                placeItems="center"
              >
                {brandSettings.brandicon ? (
                  <Box as="img" src={brandSettings.brandicon} alt="Logo" h="full" w="full" objectFit="cover" />
                ) : (
                  <Box as="img" src="/competitor-logo.svg" alt="Logo" h="4.5rem" w="4.5rem" />
                )}
              </Box>
            </motion.div>
            <Box
              as="h1"
              fontSize={{ base: 'xl', sm: '2xl' }}
              fontWeight="bold"
              color="gray.900"
              ml={{ base: '7rem', sm: '7.5rem', lg: 0 }}
              display={{ base: 'none', sm: 'block' }}
              position="relative"
              _hover={{ color: 'teal.700' }}
              transition="color 0.3s"
            >
              {brandSettings.brandName}
            </Box>
          </Flex>
        </Link>

        {/* Mobile menu button */}
        <IconButton
          display={{ md: 'none' }}
          icon={isOpen ? <HiX size={28} /> : <HiMenu size={28} />}
          onClick={onToggle}
          aria-label="Toggle navigation"
          variant="ghost"
          bg="whiteAlpha.600"
          color={textColor}
          _hover={{ bg: 'whiteAlpha.800' }}
          borderRadius="full"
          h={11}
          w={11}
        />

        {/* Desktop Navigation */}
        <HStack
          as="nav"
          spacing={3}
          display={{ base: 'none', md: 'flex' }}
        >
          {navItems.map((item) => (
            <motion.div
              key={item.name}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                as={Link}
                to={item.path}
                variant="ghost"
                leftIcon={<item.icon />}
                fontWeight="semibold"
                color={textColor}
                borderRadius="full"
                px={5}
                py={2.5}
                _hover={{
                  bg: hoverBg,
                  color: 'brand.700',
                }}
              >
                <FormattedMessage id={item.name} />
              </Button>
            </motion.div>
          ))}
          <LanguageSwitcher />
        </HStack>
      </Flex>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Box
              position="absolute"
              left={3}
              right={3}
              top="calc(100% + 10px)"
              bg="whiteAlpha.700"
              backdropFilter="blur(12px)"
              borderRadius="28px"
              border="1px solid"
              borderColor={borderColor}
              boxShadow="0 16px 48px rgba(8,42,62,0.16)"
              p={6}
              zIndex={40}
            >
              <Flex flexDir="column" gap={3}>
                {navItems.map((item) => (
                  <Button
                    key={item.name}
                    as={Link}
                    to={item.path}
                    variant="ghost"
                    leftIcon={<item.icon />}
                    fontWeight="semibold"
                    justifyContent="flex-start"
                    borderRadius="full"
                    onClick={onToggle}
                    _hover={{ bg: hoverBg }}
                  >
                    <FormattedMessage id={item.name} />
                  </Button>
                ))}
                <LanguageSwitcher />
              </Flex>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default Header;
