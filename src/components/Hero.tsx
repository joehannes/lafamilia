import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { useBrand } from '../contexts/BrandContext';
import { motion } from 'framer-motion';
import { Box, Button, Container, Heading, Text, VStack, HStack } from '@chakra-ui/react';

interface HeroProps {
  backgroundImage: string;
  backgroundVideo?: string;
}

const Hero: React.FC<HeroProps> = ({ backgroundImage, backgroundVideo }) => {
  const { brandSettings } = useBrand();

  return (
    <Box
      as="section"
      position="relative"
      overflow="hidden"
      bg="brand.900"
      zIndex={20}
      boxShadow="0 40px 100px -20px rgba(0,0,0,0.8)"
      minH="86vh"
      display="flex"
      alignItems="center"
      py={{ base: 24, md: 28 }}
      sx={{
        backgroundImage: `url('${backgroundImage}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {backgroundVideo && (
        <Box
          as="video"
          position="absolute"
          inset={0}
          zIndex={-20}
          h="full"
          w="full"
          transform="scale(1.10)"
          objectFit="cover"
          opacity={0.75}
          src={backgroundVideo}
          autoPlay
          muted
          loop
          playsInline
          poster={backgroundImage}
          aria-hidden="true"
        />
      )}
      <Box
        position="absolute"
        inset={0}
        zIndex={-10}
        bg="linear-gradient(120deg,rgba(6,33,50,.62),rgba(10,97,117,.32)_46%,rgba(237,163,79,.22))"
      />
      <Box
        position="absolute"
        inset={0}
        zIndex={-10}
        bg="radial-gradient(circle_at_20%_18%,rgba(255,255,255,.18),transparent_22%),radial-gradient(circle_at_88%_80%,rgba(20,184,166,.18),transparent_30%)"
      />

      <Container maxW="7xl" px={{ base: 4, md: 8 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box
            maxW="3xl"
            p={{ base: 7, md: 12 }}
            bg="rgba(255, 253, 240, 0.50)"
            backdropFilter="blur(12px)"
            borderRadius="2xl"
            boxShadow="0 8px 32px rgba(0,0,0,0.1)"
          >
            <VStack align="start" spacing={6}>
              <Text fontSize="sm" fontWeight="bold" textTransform="uppercase" color="ocean.900">
                Bavaro · Punta Cana · Dominican Republic
              </Text>
              <Heading
                as="h1"
                fontSize={{ base: '5xl', md: '7xl' }}
                fontWeight="bold"
                lineHeight="tight"
                color="gray.900"
                fontFamily="heading"
              >
                <FormattedMessage id="hero.title" values={{ brand: brandSettings.brandName }} />
              </Heading>
              <Text fontSize={{ base: 'lg', md: 'xl' }} lineHeight="tall" color="gray.800" maxW="2xl">
                <FormattedMessage id="hero.subtitle" />
              </Text>
              <HStack flexWrap="wrap" gap={4}>
                <Button
                  as={Link}
                  to="/tours#top"
                  bg="brand.500"
                  color="white"
                  px={6}
                  py={6}
                  borderRadius="full"
                  fontWeight="semibold"
                  _hover={{ bg: 'brand.600', transform: 'translateY(-2px)' }}
                  transition="all 0.2s"
                >
                  <FormattedMessage id="hero.cta" />
                </Button>
                <Button
                  as={Link}
                  to="/transport#top"
                  variant="outline"
                  borderColor="brand.500"
                  color="brand.600"
                  px={6}
                  py={6}
                  borderRadius="full"
                  fontWeight="semibold"
                  _hover={{ bg: 'brand.50', borderColor: 'brand.600' }}
                >
                  <FormattedMessage id="nav.transport" defaultMessage="Transport" />
                </Button>
                <Button
                  as={Link}
                  to="/contact#top"
                  variant="outline"
                  borderColor="brand.500"
                  color="brand.600"
                  px={6}
                  py={6}
                  borderRadius="full"
                  fontWeight="semibold"
                  _hover={{ bg: 'brand.50', borderColor: 'brand.600' }}
                >
                  <FormattedMessage id="contact.title" />
                </Button>
              </HStack>
            </VStack>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Hero;
