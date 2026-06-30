import React, { useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { MdAdminPanelSettings } from 'react-icons/md';
import { FaInstagram, FaTiktok, FaFacebook, FaYoutube, FaTwitter, FaLinkedin } from 'react-icons/fa';
import { motion } from 'framer-motion';
import {
  Box,
  Flex,
  VStack,
  HStack,
  Heading,
  Text,
  Link as ChakraLink,
  Icon,
} from '@chakra-ui/react';
import { useBrand } from '../../contexts/BrandContext';
import { getSocialMediaData, SocialMediaAccount } from '../../services/socialMediaService';

const platformIcons: Record<string, React.ReactNode> = {
  instagram: <FaInstagram />,
  tiktok: <FaTiktok />,
  facebook: <FaFacebook />,
  youtube: <FaYoutube />,
  twitter: <FaTwitter />,
  linkedin: <FaLinkedin />
};

const Footer = () => {
  const { brandSettings } = useBrand();
  const [socialAccounts, setSocialAccounts] = useState<SocialMediaAccount[]>([]);

  useEffect(() => {
    const loadSocialAccounts = async () => {
      const data = await getSocialMediaData();
      setSocialAccounts(data.accounts.filter((a: SocialMediaAccount) => a.enabled));
    };
    loadSocialAccounts();
  }, []);

  return (
    <Box
      as="footer"
      position="relative"
      overflow="hidden"
      borderTopWidth="1px"
      borderColor="whiteAlpha.200"
      bgGradient="linear(to-br, slate.950, slate.900, #0f1724)"
      py={16}
      color="slate.100"
      boxShadow="inset 0 0 80px rgba(0,0,0,0.3)"
    >
      {/* Background gradients */}
      <Box
        position="absolute"
        inset={0}
        bg="radial-gradient(circle at 12% 10%, rgba(255,214,126,0.12), transparent 30%), radial-gradient(circle at 88% 18%, rgba(125,211,252,0.12), transparent 34%), radial-gradient(circle at 50% 50%, rgba(23,182,168,0.08), transparent 60%)"
      />
      
      <VStack
        position="relative"
        zIndex={10}
        maxW="7xl"
        mx="auto"
        px={{ base: 4, md: 8 }}
        spacing={10}
        align="stretch"
      >
        <Flex
          direction={{ base: 'column', lg: 'row' }}
          gap={10}
        >
          {/* Brand section */}
          <Box flex={{ lg: 1 }}>
            <HStack mb={6} gap={3}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Box
                  h={14}
                  w={14}
                  borderRadius="full"
                  bgGradient="linear(to-br, whiteAlpha.100, cyan.50)"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  border="1px solid"
                  borderColor="whiteAlpha.300"
                  backdropFilter="blur(12px)"
                  boxShadow="lg"
                  overflow="hidden"
                >
                  {brandSettings.brandicon ? (
                    <Box as="img" src={brandSettings.brandicon} alt="Logo" h="full" w="full" objectFit="cover" />
                  ) : (
                    <Box as="img" src="/competitor-logo.svg" alt="Logo" h={10} w={10} />
                  )}
                </Box>
              </motion.div>
              <Heading size="lg" color="white">
                {brandSettings.brandName}
              </Heading>
            </HStack>
            <Text maxW="md" color="slate.200">
              <FormattedMessage id="footer.description" />
            </Text>
            
            {/* Social Media Icons */}
            {socialAccounts.length > 0 && (
              <HStack mt={8} gap={3}>
                {socialAccounts.map((account) => (
                  <motion.a
                    key={account.platform}
                    href={account.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400 }}
                    display="grid"
                    placeItems="center"
                    h={12}
                    w={12}
                    borderRadius="full"
                    bg="whiteAlpha.200"
                    color="white"
                    _hover={{ bg: 'white', color: 'teal.700' }}
                    boxShadow="0 8px 20px rgba(0,0,0,0.2)"
                    title={`Follow on ${account.platform}`}
                  >
                    {platformIcons[account.platform]}
                  </motion.a>
                ))}
              </HStack>
            )}
          </Box>

          {/* Quick Links */}
          <Box flex={{ lg: 1 }}>
            <Heading size="md" mb={4} color="white">
              <FormattedMessage id="footer.quickLinks" />
            </Heading>
            <VStack align="stretch" spacing={2} color="slate.100">
              <ChakraLink as={Link} to="/#top" color="slate.100" _hover={{ color: 'amber.200' }}>
                <FormattedMessage id="footer.home" />
              </ChakraLink>
              <ChakraLink as={Link} to="/tours#top" color="slate.100" _hover={{ color: 'amber.200' }}>
                <FormattedMessage id="footer.tours" />
              </ChakraLink>
              <ChakraLink as={Link} to="/transport#top" color="slate.100" _hover={{ color: 'amber.200' }}>
                <FormattedMessage id="footer.transport" defaultMessage="Transport" />
              </ChakraLink>
              <ChakraLink as={Link} to="/contact#top" color="slate.100" _hover={{ color: 'amber.200' }}>
                <FormattedMessage id="footer.contact" />
              </ChakraLink>
              <ChakraLink
                as={Link}
                to="/admin"
                display="inline-flex"
                alignItems="center"
                gap={1}
                color="slate.100"
                _hover={{ color: 'amber.200' }}
              >
                <Icon as={MdAdminPanelSettings} />
                <FormattedMessage id="footer.admin" />
              </ChakraLink>
            </VStack>
          </Box>

          {/* Social Media Accounts Info */}
          {socialAccounts.length > 0 && (
            <Box flex={{ lg: 1 }}>
              <Heading size="md" mb={4} color="white">
                Follow Us
              </Heading>
              <VStack align="stretch" spacing={2} fontSize="sm" color="whiteAlpha.700">
                {socialAccounts.map((account) => (
                  <HStack key={account.platform} gap={2}>
                    <Box color="amber.200">{platformIcons[account.platform]}</Box>
                    <ChakraLink
                      href={account.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      textTransform="capitalize"
                      _hover={{ color: 'amber.200' }}
                    >
                      {account.platform} @{account.username}
                    </ChakraLink>
                  </HStack>
                ))}
              </VStack>
            </Box>
          )}
        </Flex>

        <Box
          mt={10}
          pt={6}
          borderTopWidth="1px"
          borderColor="whiteAlpha.200"
          fontSize="sm"
          color="whiteAlpha.700"
        >
          <FormattedMessage id="footer.copyright" values={{ year: new Date().getFullYear() }} />
        </Box>
      </VStack>
    </Box>
  );
};

export default Footer;
