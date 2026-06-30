import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { FaPlayCircle, FaMapPin, FaClock, FaUsers } from 'react-icons/fa';
import { motion } from 'framer-motion';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  Badge,
  Image,
  IconButton,
  useDisclosure,
} from '@chakra-ui/react';
import { useBrand } from '../contexts/BrandContext';
import { generateWhatsAppMessage } from '../utils/whatsapp';

interface Adventure {
  id: string;
  title: string;
  emoji: string;
  duration: string;
  vibe: string;
  description: string;
  highlights: string[];
  bestFor: string;
  vimeoUrl: string;
  imageUrl: string;
  mood: string;
}

interface AdventureCardProps {
  adventure: Adventure;
  onBook?: (adventureId: string) => void;
}

const AdventureCard: React.FC<AdventureCardProps> = ({ adventure, onBook }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const navigate = useNavigate();
  const { brandSettings } = useBrand();
  const whatsappPhone = brandSettings.phoneNumber || '+18095553333';

  const handleWhatsAppClick = () => {
    const message = `Hola! Me gustaría más información sobre: ${adventure.title}`;
    window.open(generateWhatsAppMessage(whatsappPhone, message), '_blank');
  };

  const detailPaths: Record<string, string> = {
    buggy: '/details/tours/2-buggies-adventure',
    party_boat: '/details/tours/3-party-boat-experience',
    waterfall: '/tours'
  };

  const handleShowDetails = () => {
    navigate(detailPaths[adventure.id] || '/tours');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
    >
      <Box
        h="full"
        display="flex"
        flexDirection="column"
        overflow="hidden"
        borderRadius="3xl"
        border="1px solid"
        borderColor="whiteAlpha.600"
        bg="whiteAlpha.800"
        backdropFilter="blur(12px)"
        boxShadow="0 24px 64px rgba(8,42,62,0.18), 0 8px 16px rgba(23,182,168,0.08)"
        _hover={{
          boxShadow: '0 36px 100px rgba(8,42,62,0.24), 0 12px 24px rgba(23,182,168,0.14)',
        }}
        transition="all 0.3s"
      >
        {/* Image container with overlay */}
        <Box position="relative" h={{ base: '240px', sm: '256px', md: '320px' }} overflow="hidden" bg="slate.200">
          <Image
            src={adventure.imageUrl}
            alt={adventure.title}
            h="full"
            w="full"
            objectFit="cover"
            transition="transform 0.7s"
            sx={{
              '&:hover': { transform: 'scale(1.10)' },
            }}
          />
          {/* Gradient overlay */}
          <Box
            position="absolute"
            inset={0}
            bgGradient="linear(to-t, slate.950/85, slate.950/15, transparent)"
            opacity={0}
            _hover={{ opacity: 1 }}
            transition="opacity 0.3s"
          />

          {/* Video button overlay */}
          {!showVideo && (
            <Button
              position="absolute"
              inset={0}
              display="flex"
              alignItems="center"
              justifyContent="center"
              opacity={0}
              _hover={{ opacity: 1 }}
              transition="opacity 0.3s"
              variant="unstyled"
              onClick={() => setShowVideo(true)}
            >
              <FaPlayCircle size="60px" color="white" style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))' }} />
            </Button>
          )}

          {/* Emoji badge */}
          <Box
            position="absolute"
            right={4}
            top={4}
            borderRadius="full"
            bg="whiteAlpha.900"
            p={3}
            fontSize="4xl"
            boxShadow="lg"
            backdropFilter="blur(12px)"
          >
            {adventure.emoji}
          </Box>
        </Box>

        {/* Video embed (hidden by default) */}
        {showVideo && (
          <Box position="relative" w="full" aspectRatio="16/9" bg="black">
            <iframe
              width="100%"
              height="100%"
              src={adventure.vimeoUrl.replace('vimeo.com', 'player.vimeo.com/video')}
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              title={adventure.title}
            />
            <IconButton
              position="absolute"
              top={2}
              right={2}
              zIndex={10}
              aria-label="Close video"
              icon={<span>✕</span>}
              bg="red.600"
              color="white"
              size="sm"
              _hover={{ bg: 'red.700' }}
              onClick={() => setShowVideo(false)}
            />
          </Box>
        )}

        {/* Content */}
        <VStack flex={1} align="stretch" p={{ base: 5, sm: 6 }} spacing={4}>
          {/* Title */}
          <Heading as="h3" size="xl" color="slate.900">
            {adventure.title}
          </Heading>

          {/* Quick info */}
          <HStack wrap="wrap" gap={4} fontSize="sm">
            <HStack gap={1} fontWeight="semibold" color="teal.700">
              <FaClock size="18px" />
              <Text>{adventure.duration}</Text>
            </HStack>
            <HStack gap={1} fontWeight="semibold" color="amber.700">
              <FaUsers size="18px" />
              <Text>{adventure.vibe}</Text>
            </HStack>
          </HStack>

          {/* Description */}
          <Text flex={1} fontStyle="italic" lineHeight="tall" color="slate.600">
            {adventure.description}
          </Text>

          {/* Expandable section */}
          <Box
            overflow="hidden"
            transition="max-height 0.3s"
            maxH={isExpanded ? '384px' : '0'}
          >
            <Box mt={4} borderTopWidth="1px" borderColor="teal.100" pt={4}>
              {/* Highlights */}
              <VStack align="stretch" mb={4}>
                <Heading as="h4" size="md" color="slate.900">
                  <FormattedMessage id="story.highlights" />
                </Heading>
                <VStack align="stretch" spacing={2}>
                  {adventure.highlights.map((highlight, idx) => (
                    <HStack key={idx} gap={2} fontSize="sm" color="slate.600">
                      <Text fontWeight="bold" color="teal.600">✓</Text>
                      <Text>{highlight}</Text>
                    </HStack>
                  ))}
                </VStack>
              </VStack>

              {/* Best for */}
              <VStack align="stretch" mb={4}>
                <Heading as="h4" size="md" color="slate.900">
                  <FormattedMessage id="story.bestFor" />
                </Heading>
                <Text fontSize="sm" color="slate.600">{adventure.bestFor}</Text>
              </VStack>

              {/* Mood */}
              <HStack wrap="wrap" gap={2}>
                {adventure.mood.split(', ').map((mood, idx) => (
                  <Badge
                    key={idx}
                    borderRadius="full"
                    bgGradient="linear(to-r, teal.50, amber.50)"
                    px={3}
                    py={1}
                    fontSize="xs"
                    fontWeight="semibold"
                    color="slate.700"
                  >
                    {mood}
                  </Badge>
                ))}
              </HStack>
            </Box>
          </Box>

          {/* Action buttons */}
          <HStack mt={6} direction={{ base: 'column', sm: 'row' }} gap={3}>
            <Button
              flex={1}
              borderRadius="full"
              bgGradient="linear(to-r, teal.700, cyan.600)"
              color="white"
              fontWeight="semibold"
              _hover={{ boxShadow: 'lg' }}
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Show Less' : 'Show Details'}
            </Button>
            <Button
              flex={1}
              borderRadius="full"
              bg="emerald.600"
              color="white"
              fontWeight="semibold"
              leftIcon={<FaMapPin />}
              _hover={{ bg: 'emerald.700', boxShadow: 'lg' }}
              onClick={handleWhatsAppClick}
            >
              Book Now
            </Button>
            <Button
              flex={1}
              borderRadius="full"
              variant="outline"
              borderColor="slate.200"
              bg="white"
              color="slate.900"
              fontWeight="semibold"
              _hover={{ borderColor: 'teal.600', color: 'teal.700', boxShadow: 'lg' }}
              onClick={handleShowDetails}
            >
              Show All Details
            </Button>
          </HStack>
        </VStack>
      </Box>
    </motion.div>
  );
};

export default AdventureCard;
