import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Container,
  Heading,
  Text,
  HStack,
  Badge,
  Button,
  SimpleGrid,
} from '@chakra-ui/react';
import { FaInstagram, FaTiktok, FaFacebook, FaYoutube, FaTwitter, FaPlay } from 'react-icons/fa';
import { getSocialMediaData, SocialMediaVideo } from '../services/socialMediaService';

const platformIcons: Record<string, React.ReactNode> = {
  instagram: <FaInstagram />,
  tiktok: <FaTiktok />,
  facebook: <FaFacebook />,
  youtube: <FaYoutube />,
  twitter: <FaTwitter />
};

const platformColors: Record<string, { bgGradient: string; color: string }> = {
  instagram: {
    bgGradient: 'linear(to-br, pink.500, purple.500)',
    color: 'pink.600'
  },
  tiktok: {
    bgGradient: 'linear(to-br, black, slate.800)',
    color: 'black'
  },
  facebook: {
    bgGradient: 'linear(to-br, blue.600, blue.800)',
    color: 'blue.600'
  },
  youtube: {
    bgGradient: 'linear(to-br, red.600, red.800)',
    color: 'red.600'
  },
  twitter: {
    bgGradient: 'linear(to-br, blue.400, blue.600)',
    color: 'blue.400'
  }
};

interface SocialMediaVideosProps {
  showIf?: boolean;
}

const SocialMediaVideos: React.FC<SocialMediaVideosProps> = ({ showIf = true }) => {
  const [videos, setVideos] = useState<SocialMediaVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [videosByPlatform, setVideosByPlatform] = useState<Record<string, SocialMediaVideo[]>>({});

  useEffect(() => {
    const loadVideos = async () => {
      try {
        const data = await getSocialMediaData();
        if (data.videos && data.videos.length > 0) {
          setVideos(data.videos);
          const grouped: Record<string, SocialMediaVideo[]> = {};
          data.videos.forEach((video: SocialMediaVideo) => {
            if (!grouped[video.platform]) {
              grouped[video.platform] = [];
            }
            grouped[video.platform].push(video);
          });
          setVideosByPlatform(grouped);
        }
      } catch (error) {
        console.error('Error loading social media videos:', error);
      } finally {
        setLoading(false);
      }
    };
    loadVideos();
  }, []);

  if (!showIf || loading || videos.length === 0) {
    return null;
  }

  const platforms = Object.keys(videosByPlatform);

  return (
    <Box
      as="section"
      py={24}
      px={{ base: 4, md: 8 }}
      bgGradient="linear(to-b, slate.50, white)"
      position="relative"
      overflow="hidden"
    >
      <Box position="absolute" inset={0} opacity={0.05} pointerEvents="none">
        <Box
          position="absolute"
          top={0}
          left={0}
          w={96}
          h={96}
          bgGradient="linear(to-b, pink.300, transparent)"
          borderRadius="full"
          blur="3xl"
        />
        <Box
          position="absolute"
          bottom={0}
          right={0}
          w={96}
          h={96}
          bgGradient="linear(to-t, blue.300, transparent)"
          borderRadius="full"
          blur="3xl"
        />
      </Box>

      <Container maxW="7xl" position="relative" zIndex={10}>
        <Box textAlign="center" mb={16}>
          <Heading as="h2" size="2xl" mb={4} color="slate.900">
            Follow Our Adventures
          </Heading>
          <Text fontSize="xl" color="slate.600" maxW="2xl" mx="auto">
            Watch exclusive behind-the-scenes content and adventure highlights from across our social media
          </Text>
        </Box>

        <Box spacing={16}>
          {platforms.map((platform) => (
            <Box key={platform} mb={16}>
              <Badge
                display="inline-flex"
                alignItems="center"
                gap={3}
                px={6}
                py={3}
                bgGradient={platformColors[platform].bgGradient}
                color="white"
                borderRadius="full"
                boxShadow="lg"
                fontSize="lg"
                fontWeight="bold"
                textTransform="capitalize"
              >
                {platformIcons[platform]}
                <span>{platform}</span>
              </Badge>

              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} mt={6}>
                {videosByPlatform[platform].map((video) => (
                  <motion.div
                    key={video.id}
                    whileHover={{ y: -8 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Box
                      position="relative"
                      borderRadius="2xl"
                      overflow="hidden"
                      boxShadow="lg"
                      _hover={{ boxShadow: '2xl', borderColor: 'transparent' }}
                      border="1px solid"
                      borderColor="slate.200/70"
                      display="flex"
                      flexDirection="column"
                      h="full"
                      bg="white"
                    >
                      <Box
                        position="relative"
                        h={64}
                        bgGradient={platformColors[platform].bgGradient}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        overflow="hidden"
                      >
                        <Box
                          position="absolute"
                          inset={0}
                          bg="blackAlpha.400"
                          _groupHover={{ bg: 'blackAlpha.600' }}
                          transition="all 0.3s"
                        />
                        <Box
                          as={FaPlay}
                          fontSize="6xl"
                          color="whiteAlpha.800"
                          _groupHover={{ color: 'white', transform: 'scale(1.25)' }}
                          transition="all 0.3s"
                        />
                        <Box
                          position="absolute"
                          inset={0}
                          display="flex"
                          flexDirection="column"
                          justifyContent="flex-end"
                          p={4}
                          bgGradient="linear(to-t, blackAlpha.800, blackAlpha.200, transparent)"
                          opacity={0}
                          _groupHover={{ opacity: 1 }}
                          transition="opacity 0.3s"
                        >
                          <Text fontSize="sm" fontWeight="semibold" color="white">
                            {video.title}
                          </Text>
                        </Box>
                      </Box>

                      <Box flex={1} p={5} bg="white" spacing={4}>
                        <Box spacing={3}>
                          <Heading as="h3" size="md" color="slate.900" noOfLines={2}>
                            {video.title}
                          </Heading>
                          <Text fontSize="sm" color="slate.600" noOfLines={2}>
                            {video.description}
                          </Text>
                          <Text fontSize="xs" color="slate.500">
                            {video.createdAt}
                          </Text>
                        </Box>

                        <Button
                          as="a"
                          href={video.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          w="full"
                          mt="auto"
                          py={3}
                          px={4}
                          bgGradient="linear(to-r, pink.500, orange.500)"
                          color="white"
                          fontWeight="bold"
                          borderRadius="xl"
                          _hover={{ boxShadow: 'lg', transform: 'scale(1.05)' }}
                          transition="all 0.2s"
                        >
                          Watch on {platform.charAt(0).toUpperCase() + platform.slice(1)}
                        </Button>
                      </Box>
                    </Box>
                  </motion.div>
                ))}
              </SimpleGrid>
            </Box>
          ))}
        </Box>

        <Box mt={16} textAlign="center">
          <Text color="slate.600" mb={6}>
            Like what you see? Follow us on social media for daily adventure content!
          </Text>
          <HStack justify="center" gap={4} flexWrap="wrap">
            {platforms.map((platform) => {
              const baseUrls: Record<string, string> = {
                instagram: 'https://instagram.com',
                tiktok: 'https://tiktok.com',
                facebook: 'https://facebook.com',
                youtube: 'https://youtube.com',
                twitter: 'https://twitter.com'
              };
              const url = baseUrls[platform] || '#';

              return (
                <Button
                  key={platform}
                  as="a"
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  display="inline-flex"
                  alignItems="center"
                  gap={2}
                  px={6}
                  py={3}
                  bgGradient={platformColors[platform].bgGradient}
                  color="white"
                  fontWeight="bold"
                  borderRadius="lg"
                  _hover={{ boxShadow: 'lg', transform: 'scale(1.05)' }}
                  transition="all 0.2s"
                >
                  {platformIcons[platform]}
                  <Text display={{ base: 'none', sm: 'inline' }} capitalize>
                    {platform}
                  </Text>
                </Button>
              );
            })}
          </HStack>
        </Box>
      </Container>
    </Box>
  );
};

export default SocialMediaVideos;
