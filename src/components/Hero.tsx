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
        bg="linear-gradient(135deg,rgba(190,24,93,0.5),rgba(6,33,50,0.55),rgba(10,97,117,0.35))"
      />
      <Box
        position="absolute"
        inset={0}
        zIndex={-10}
        bg="radial-gradient(circle_at_20%_18%,rgba(255,255,255,0.18),transparent_22%),radial-gradient(circle_at_88%_80%,rgba(244,114,182,0.18),transparent_30%)"
      />
      
      {/* Decorative SVG Shapes - Canadian Feminine Touch */}
      <Box
        position="absolute"
        top="10%"
        left="5%"
        zIndex={-5}
        opacity={0.3}
        animation="float 8s ease-in-out infinite"
      >
        <svg width="120" height="120" viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="45" stroke="rgba(244,114,182,0.4)" strokeWidth="2" fill="none"/>
          <circle cx="50" cy="50" r="30" stroke="rgba(251,113,133,0.3)" strokeWidth="1.5" fill="none"/>
          <circle cx="50" cy="50" r="15" fill="rgba(244,114,182,0.2)"/>
        </svg>
      </Box>
      
      <Box
        position="absolute"
        bottom="15%"
        right="8%"
        zIndex={-5}
        opacity={0.25}
        animation="float 10s ease-in-out infinite reverse"
      >
        <svg width="150" height="150" viewBox="0 0 100 100" fill="none">
          <path d="M50 5 L61 35 L95 35 L68 55 L79 88 L50 70 L21 88 L32 55 L5 35 L39 35 Z" 
                fill="rgba(236,72,153,0.15)" 
                stroke="rgba(244,114,182,0.4)" 
                strokeWidth="1.5"/>
        </svg>
      </Box>
      
      <Box
        position="absolute"
        top="20%"
        right="15%"
        zIndex={-5}
        opacity={0.2}
      >
        <svg width="80" height="80" viewBox="0 0 100 100" fill="none">
          <ellipse cx="50" cy="50" rx="40" ry="25" 
                   stroke="rgba(56,189,248,0.3)" 
                   strokeWidth="2" 
                   fill="none"
                   transform="rotate(-30 50 50)"/>
        </svg>
      </Box>
      
      {/* Maple Leaf Pattern Overlay */}
      <Box className="maple-leaf-pattern" inset={0} zIndex={-5} />

      <Container maxW="7xl" px={{ base: 4, md: 8 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box
            maxW="3xl"
            p={{ base: 7, md: 12 }}
            bg="rgba(255, 253, 240, 0.55)"
            backdropFilter="blur(16px)"
            borderRadius="3xl"
            boxShadow="0 12px 48px rgba(236,72,153,0.15), 0 8px 24px rgba(56,189,248,0.1)"
            border="1px solid"
            borderColor="rgba(255,255,255,0.4)"
            position="relative"
            overflow="hidden"
          >
            {/* Inner decorative corner flourishes */}
            <Box position="absolute" top="0" left="0" w="40px" h="40px" opacity={0.3}>
              <svg viewBox="0 0 40 40" fill="none">
                <path d="M0,20 Q10,0 20,0 L40,0" stroke="rgba(244,114,182,0.5)" strokeWidth="2" fill="none"/>
              </svg>
            </Box>
            <Box position="absolute" bottom="0" right="0" w="40px" h="40px" opacity={0.3} transform="rotate(180deg)">
              <svg viewBox="0 0 40 40" fill="none">
                <path d="M0,20 Q10,0 20,0 L40,0" stroke="rgba(56,189,248,0.5)" strokeWidth="2" fill="none"/>
              </svg>
            </Box>
            
            <VStack align="start" spacing={6}>
              <Text 
                fontSize="sm" 
                fontWeight="bold" 
                textTransform="uppercase" 
                color="ocean.900"
                letterSpacing="0.15em"
              >
                Bavaro · Punta Cana · Dominican Republic
              </Text>
              <Heading
                as="h1"
                fontSize={{ base: '5xl', md: '7xl' }}
                fontWeight="bold"
                lineHeight="tight"
                color="gray.900"
                fontFamily="heading"
                className="heading-feminine"
              >
                <FormattedMessage id="hero.title" values={{ brand: brandSettings.brandName }} />
              </Heading>
              <Text 
                fontSize={{ base: 'lg', md: 'xl' }} 
                lineHeight="tall" 
                color="gray.800" 
                maxW="2xl"
                className="text-elegant"
              >
                <FormattedMessage id="hero.subtitle" />
              </Text>
              <HStack flexWrap="wrap" gap={4}>
                <Button
                  as={Link}
                  to="/tours#top"
                  bgGradient="linear(to-r, pink.600, rose.500)"
                  color="white"
                  px={8}
                  py={6}
                  borderRadius="full"
                  fontWeight="semibold"
                  _hover={{ 
                    bgGradient: "linear(to-r, pink.700, rose.600)", 
                    transform: 'translateY(-3px)',
                    boxShadow: 'lg'
                  }}
                  transition="all 0.3s"
                  boxShadow="md"
                >
                  <FormattedMessage id="hero.cta" />
                </Button>
                <Button
                  as={Link}
                  to="/transport#top"
                  variant="outline"
                  borderColor="pink.400"
                  color="pink.700"
                  px={6}
                  py={6}
                  borderRadius="full"
                  fontWeight="semibold"
                  _hover={{ 
                    bg: 'pink.50', 
                    borderColor: 'pink.500',
                    transform: 'translateY(-2px)'
                  }}
                  transition="all 0.2s"
                >
                  <FormattedMessage id="nav.transport" defaultMessage="Transport" />
                </Button>
                <Button
                  as={Link}
                  to="/contact#top"
                  variant="outline"
                  borderColor="cyan.400"
                  color="cyan.700"
                  px={6}
                  py={6}
                  borderRadius="full"
                  fontWeight="semibold"
                  _hover={{ 
                    bg: 'cyan.50', 
                    borderColor: 'cyan.500',
                    transform: 'translateY(-2px)'
                  }}
                  transition="all 0.2s"
                >
                  <FormattedMessage id="contact.title" />
                </Button>
              </HStack>
            </VStack>
          </Box>
        </motion.div>
      </Container>
      
      {/* Bottom Wave Divider */}
      <Box className="wave-divider-bottom" />
    </Box>
  );
};

export default Hero;
