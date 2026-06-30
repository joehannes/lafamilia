import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Box, VStack, Heading, Text, Container, SimpleGrid, HStack, Link as ChakraLink } from '@chakra-ui/react';
import ContactForm from '../components/ContactForm';
import { useBrand } from '../contexts/BrandContext';

const Contact = () => {
  const { brandSettings } = useBrand();
  
  return (
    <Box as="section" py={{ base: 16, md: 20 }}>
      <Container maxW="7xl" px={{ base: 4, md: 8 }}>
        <VStack mb={10} textAlign="center">
          <Heading as="h1" fontSize={{ base: '4xl', md: '5xl' }} fontWeight="bold" color="slate.900" mb={4}>
            <FormattedMessage id="contact.title" />
          </Heading>
          <Text mx="auto" maxW="2xl" fontSize="lg" color="slate.600">
            <FormattedMessage id="contact.description" />
          </Text>
        </VStack>

        <SimpleGrid columns={{ base: 1, lg: 2 }} gap={10}>
          <ContactForm />
          <Box
            p={8}
            borderRadius="3xl"
            bg="whiteAlpha.700"
            backdropFilter="blur(12px)"
            border="1px solid"
            borderColor="whiteAlpha.500"
            boxShadow="0 24px 64px rgba(8,42,62,0.18)"
          >
            <Heading as="h2" size="2xl" fontWeight="bold" color="slate.900" mb={5}>
              <FormattedMessage id="contact.getInTouch" />
            </Heading>
            <Text mb={2} color="slate.700">
              <FormattedMessage id="contact.addressLabel" />: Bávaro, Punta Cana
            </Text>
            <Text mb={6} color="slate.700">
              <FormattedMessage id="contact.phoneLabel" />: {brandSettings.phoneNumber}
            </Text>
            <HStack flexDir={{ base: 'column', sm: 'row' }} gap={3} mb={6}>
              {brandSettings.paypalMeLink && (
                <ChakraLink
                  href={brandSettings.paypalMeLink}
                  target="_blank"
                  rel="noreferrer"
                  as="a"
                  w="full"
                  sm="auto"
                  px={6}
                  py={3}
                  borderRadius="full"
                  bgGradient="linear(to-r, teal.600, cyan.500)"
                  color="white"
                  fontWeight="semibold"
                  textAlign="center"
                  _hover={{ boxShadow: 'lg', transform: 'translateY(-2px)' }}
                  transition="all 0.2s"
                >
                  <FormattedMessage id="payment.paypalContact" defaultMessage="Pay deposit with PayPal" />
                </ChakraLink>
              )}
              {brandSettings.verifoneLink && (
                <ChakraLink
                  href={brandSettings.verifoneLink}
                  target="_blank"
                  rel="noreferrer"
                  as="a"
                  w="full"
                  sm="auto"
                  px={6}
                  py={3}
                  borderRadius="full"
                  variant="outline"
                  borderColor="teal.600"
                  color="teal.700"
                  fontWeight="semibold"
                  textAlign="center"
                  _hover={{ bg: 'teal.50' }}
                >
                  <FormattedMessage id="payment.verifoneContact" defaultMessage="Pay deposit with Verifone" />
                </ChakraLink>
              )}
            </HStack>
            <Box
              as="iframe"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d60530.5!2d-68.4156!3d18.6945!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8ea891645dcbfe77%3A0x4877e4aeefa14d62!2sEl%20Cortecito%2C%20Punta%20Cana!5e0!3m2!1sen!2sdo!4v1234567890123!5m2!1sen!2sdo"
              width="100%"
              height="280"
              style={{ border: 0, borderRadius: '18px', marginTop: '24px' }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Punta Cana Location"
            />
          </Box>
        </SimpleGrid>
      </Container>
    </Box>
  );
};

export default Contact;
