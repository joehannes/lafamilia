import React, { useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  Container,
  SimpleGrid,
} from '@chakra-ui/react';
import Hero from '../components/Hero';
import StorySection from '../components/StorySection';
import AdventureCard from '../components/AdventureCard';
import TestimonialDisplay from '../components/TestimonialDisplay';
import SocialMediaVideos from '../components/SocialMediaVideos';
import FABWhatsApp from '../components/FABWhatsApp';
import { useBrand } from '../contexts/BrandContext';
import { useI18n } from '../contexts/I18nContext';
import { generateWhatsAppMessage } from '../utils/whatsapp';
import { generateBlogListStructuredData } from '../utils/seoHelpers';
import { getFallbackIntroStory, getIntroStoryPreferred, StoryData } from '../services/introStoryService';
import { useBlog } from '../contexts/BlogContext';

const HERO_BACKGROUND_IMAGE = '/imgs/tours/tour_saona_island_detail_12.jpg';
const HERO_BACKGROUND_VIDEO = '/mariotours.mp4';

const Home: React.FC = () => {
  const { brandSettings } = useBrand();
  const { locale } = useI18n();
  const { blogArticles } = useBlog();
  const navigate = useNavigate();
  const [storyData, setStoryData] = useState<StoryData | null>(null);
  const seoArticles = blogArticles[locale] ?? [];
  const hiddenBlogStyle = {
    position: 'absolute' as const,
    left: '-9999px',
    top: 'auto',
    width: '1px',
    height: '1px',
    overflow: 'hidden',
  };

  useEffect(() => {
    let isCurrent = true;

    getIntroStoryPreferred(locale).then((data) => {
      if (isCurrent) {
        setStoryData(data);
      }
    });

    return () => {
      isCurrent = false;
    };
  }, [locale]);

  useEffect(() => {
    if (seoArticles.length === 0) {
      return;
    }

    generateBlogListStructuredData(
      locale === 'es' ? 'Blog de Tours' : 'Blog',
      locale === 'es'
        ? 'Entradas del blog de viajes en Punta Cana para SEO y motores de búsqueda.'
        : 'Punta Cana travel blog entries for SEO and search engines.',
      seoArticles
    );

    return () => {
      document.querySelectorAll('script[type="application/ld+json"]').forEach((script) => {
        if (script.textContent?.includes('Blog')) {
          script.remove();
        }
      });
    };
  }, [locale, seoArticles]);

  return (
    <Box id="top" position="relative">
      {/* FAB WhatsApp Button */}
      <FABWhatsApp phoneNumber={brandSettings.phoneNumber} />

      {/* Hero Section */}
      <Hero backgroundImage={HERO_BACKGROUND_IMAGE} backgroundVideo={HERO_BACKGROUND_VIDEO} />

      {seoArticles.length > 0 && (
        <section aria-hidden="true" style={hiddenBlogStyle}>
          <Heading size="lg">{locale === 'es' ? 'Blog' : 'Blog'}</Heading>
          {seoArticles.map((article) => (
            <Box as="article" key={article.id}>
              <Heading size="md">{article.title}</Heading>
              <Text>{article.post.slice(0, 180)}</Text>
            </Box>
          ))}
        </section>
      )}

      {/* Story Narrative Sections */}
      <VStack spacing={0} minH="50vh" align="stretch">
        {!storyData ? (
          <Box
            py={32}
            display="flex"
            justifyContent="center"
            alignItems="center"
            bgGradient="linear(to-b, teal.50, teal.100)"
          >
            <VStack align="center" gap={6} className="animate-pulse">
              <Box w={16} h={16} borderRadius="full" bg="teal.800/10" />
              <Text fontSize="2xl" color="teal.900/40" fontWeight="bold">
                Loading your tropical journey...
              </Text>
            </VStack>
          </Box>
        ) : (
          storyData.sections.map((section, index) => {
            if (section.id === 'adventure_preview') {
              // Adventure preview section with cards
              return (
                <Box
                  key={section.id}
                  id={section.id}
                  position="relative"
                  overflow="hidden"
                  px={{ base: 4, md: 8 }}
                  py={{ base: 24, sm: 28, lg: 32 }}
                  bgGradient="linear(to-b, teal.100, cyan.50)"
                >
                  {/* Parallax wash elements */}
                  <Box className="parallax-wash parallax-wash-left" />
                  <Box className="parallax-wash parallax-wash-right" />

                  <Container maxW="6xl" position="relative" zIndex={10}>
                    {/* Header */}
                    <VStack
                      mx="auto"
                      mb={{ base: 12, sm: 16 }}
                      maxW="3xl"
                      textAlign="center"
                      spacing={4}
                    >
                      <Box
                        fontSize="5xl"
                        mx="auto"
                        mb={5}
                      >
                        {section.emoji}
                      </Box>
                      <Heading
                        as="h2"
                        fontSize={{ base: '3xl', sm: '4xl', md: '5xl' }}
                        fontWeight="bold"
                        lineHeight="tight"
                        color="slate.950"
                      >
                        {section.title}
                      </Heading>
                      <Text
                        mx="auto"
                        maxW="2xl"
                        fontSize={{ base: 'lg', sm: 'xl' }}
                        lineHeight="tall"
                        color="slate.600"
                      >
                        {section.description}
                      </Text>
                    </VStack>

                    {/* Adventure cards grid */}
                    {section.adventures && (
                      <SimpleGrid columns={{ base: 1, md: 3 }} gap={{ base: 7, lg: 8 }}>
                        {section.adventures.map((adventure) => (
                          <AdventureCard key={adventure.id} adventure={adventure} />
                        ))}
                      </SimpleGrid>
                    )}
                  </Container>
                </Box>
              );
            }

            // Regular story sections
            return (
              <StorySection
                key={section.id}
                id={section.id}
                title={section.title}
                emoji={section.emoji}
                timeframe={section.timeframe}
                description={section.description}
                narrative={section.narrative || ''}
                imageUrl={section.imageUrl}
                vimeoUrl={section.vimeoUrl}
                mood={section.mood || ''}
                isAlternate={index % 2 === 1}
                themeName={['shore-section', 'lagoon-section', 'cove-section', 'bay-section'][index % 4]}
              />
            );
          })
        )}
      </VStack>

      {/* Call-to-Action Banner */}
      {!storyData ? null : storyData.callToActions && storyData.callToActions.length > 0 ? (
        <Box
          px={{ base: 4, md: 8 }}
          py={{ base: 20, sm: 24 }}
          bgGradient="linear(to-r, pink.600, orange.500)"
          color="white"
        >
          <Container maxW="4xl" textAlign="center">
            <VStack spacing={6} align="center">
              <Heading
                as="h2"
                fontSize={{ base: '3xl', sm: '4xl', md: '5xl' }}
                fontWeight="bold"
                lineHeight="tight"
                color="white"
              >
                {storyData.storyTitle || 'Ready for Your Perfect Day in Paradise?'}
              </Heading>
              {storyData.storyTagline && (
                <Text
                  mx="auto"
                  maxW="2xl"
                  fontSize={{ base: 'lg', sm: 'xl' }}
                  lineHeight="tall"
                  color="whiteAlpha.900"
                >
                  {storyData.storyTagline}
                </Text>
              )}
              <HStack
                direction={{ base: 'column', sm: 'row' }}
                justify="center"
                gap={4}
              >
                {storyData.callToActions.map((cta, i) => (
                  <motion.button
                    key={`${cta.text}-${i}`}
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400 }}
                    onClick={() => {
                      if (cta.target?.startsWith('http')) {
                        window.open(cta.target, '_blank');
                      } else {
                        navigate(cta.target || '/');
                      }
                    }}
                    style={{
                      padding: '1rem 2rem',
                      backgroundColor: 'white',
                      color: '#db2777',
                      fontWeight: 'bold',
                      borderRadius: '0.5rem',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    {cta.text}
                  </motion.button>
                ))}
              </HStack>
            </VStack>
          </Container>
        </Box>
      ) : (
        <Box
          px={{ base: 4, md: 8 }}
          py={{ base: 20, sm: 24 }}
          bgGradient="linear(to-r, pink.600, orange.500)"
          color="white"
        >
          <Container maxW="4xl" textAlign="center">
            <VStack spacing={6} align="center">
              <Heading
                as="h2"
                fontSize={{ base: '3xl', sm: '4xl', md: '5xl' }}
                fontWeight="bold"
                lineHeight="tight"
                color="white"
              >
                Ready for Your Perfect Day in Paradise?
              </Heading>
              <Text
                mx="auto"
                maxW="2xl"
                fontSize={{ base: 'lg', sm: 'xl' }}
                lineHeight="tall"
                color="whiteAlpha.900"
              >
                Your adventure is just one click away. Contact us on WhatsApp or choose your adventure below.
              </Text>
              <HStack
                direction={{ base: 'column', sm: 'row' }}
                justify="center"
                gap={4}
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400 }}
                  onClick={() =>
                    window.open(
                      generateWhatsAppMessage(
                        brandSettings.phoneNumber,
                        'Hola! Me gustaría información sobre sus tours.'
                      ),
                      '_blank'
                    )
                  }
                  style={{
                    padding: '1rem 2rem',
                    backgroundColor: 'white',
                    color: '#db2777',
                    fontWeight: 'bold',
                    borderRadius: '0.5rem',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Chat on WhatsApp
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400 }}
                  onClick={() => navigate('/tours')}
                  style={{
                    padding: '1rem 2rem',
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    fontWeight: 'bold',
                    borderRadius: '0.5rem',
                    border: '2px solid white',
                    cursor: 'pointer',
                  }}
                >
                  View Adventures
                </motion.button>
              </HStack>
            </VStack>
          </Container>
        </Box>
      )}

      {/* Testimonials Section */}
      <TestimonialDisplay locale={locale} />

      {/* Why Choose Us Section - Enhanced */}
      <Box
        px={{ base: 4, md: 8 }}
        py={{ base: 20, sm: 24 }}
        bgGradient="linear(to-br, teal.700, cyan.600)"
        color="white"
      >
        <Container maxW="6xl">
          <VStack
            mx="auto"
            mb={{ base: 12, sm: 16 }}
            maxW="3xl"
            textAlign="center"
            spacing={4}
          >
            <Heading
              as="h2"
              fontSize={{ base: '3xl', sm: '4xl', md: '5xl' }}
              fontWeight="bold"
              lineHeight="tight"
              color="white"
            >
              <FormattedMessage id="features.title" />
            </Heading>
            <Text fontSize={{ base: 'lg', sm: 'xl' }} lineHeight="tall" color="whiteAlpha.700">
              Thoughtful service from arrival to return
            </Text>
          </VStack>

          <SimpleGrid columns={{ base: 1, md: 3 }} gap={{ base: 6, lg: 8 }}>
            {/* Safety First */}
            <motion.div
              whileHover={{ y: -8 }}
              transition={{ duration: 0.3 }}
            >
              <Box
                p={8}
                borderRadius="2xl"
                bg="whiteAlpha.100"
                backdropFilter="blur(12px)"
                border="1px solid"
                borderColor="whiteAlpha.200"
                _hover={{ bg: 'whiteAlpha.200' }}
                transition="all 0.3s"
              >
                <VStack align="start" spacing={3}>
                  <Box fontSize="5xl">🛡️</Box>
                  <Heading size="lg" color="white">
                    <FormattedMessage id="features.safety.title" />
                  </Heading>
                  <Text color="slate.300">
                    <FormattedMessage id="features.safety.description" />
                  </Text>
                </VStack>
              </Box>
            </motion.div>

            {/* Curated Experiences */}
            <motion.div
              whileHover={{ y: -8 }}
              transition={{ duration: 0.3 }}
            >
              <Box
                p={8}
                borderRadius="2xl"
                bg="whiteAlpha.100"
                backdropFilter="blur(12px)"
                border="1px solid"
                borderColor="whiteAlpha.200"
                _hover={{ bg: 'whiteAlpha.200' }}
                transition="all 0.3s"
              >
                <VStack align="start" spacing={3}>
                  <Box fontSize="5xl">🌿</Box>
                  <Heading size="lg" color="white">
                    <FormattedMessage id="features.experiences.title" />
                  </Heading>
                  <Text color="slate.300">
                    <FormattedMessage id="features.experiences.description" />
                  </Text>
                </VStack>
              </Box>
            </motion.div>

            {/* Transportation */}
            <motion.div
              whileHover={{ y: -8 }}
              transition={{ duration: 0.3 }}
            >
              <Box
                p={8}
                borderRadius="2xl"
                bg="whiteAlpha.100"
                backdropFilter="blur(12px)"
                border="1px solid"
                borderColor="whiteAlpha.200"
                _hover={{ bg: 'whiteAlpha.200' }}
                transition="all 0.3s"
              >
                <VStack align="start" spacing={3}>
                  <Box fontSize="5xl">🚗</Box>
                  <Heading size="lg" color="white">
                    <FormattedMessage id="features.transportation.title" />
                  </Heading>
                  <Text color="slate.300">
                    <FormattedMessage id="features.transportation.description" />
                  </Text>
                </VStack>
              </Box>
            </motion.div>
          </SimpleGrid>
        </Container>
      </Box>

      {/* Final CTA Section */}
      <Box
        position="relative"
        overflow="hidden"
        px={{ base: 4, md: 8 }}
        py={{ base: 20, sm: 24 }}
        bgGradient="linear(to-b, cyan.50, teal.100)"
      >
        <Box className="parallax-wash parallax-wash-right" />

        <Container maxW="4xl" position="relative" zIndex={10} textAlign="center">
          <VStack spacing={6} align="center">
            <Heading
              as="h2"
              fontSize={{ base: '3xl', sm: '4xl', md: '5xl' }}
              fontWeight="bold"
              lineHeight="tight"
              color="slate.900"
            >
              Your Caribbean Day Awaits
            </Heading>
            <Text
              mx="auto"
              maxW="2xl"
              fontSize={{ base: 'lg', sm: 'xl' }}
              lineHeight="tall"
              color="slate.700"
            >
              Step into warm water, fresh air, local flavor, and a day that stays with you.
            </Text>
            <motion.button
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
              onClick={() =>
                window.open(
                  generateWhatsAppMessage(
                    brandSettings.phoneNumber,
                    'Hola! Quiero hacer una reserva. ¿Cuáles son mis opciones?'
                  ),
                  '_blank'
                )
              }
              style={{
                padding: '1rem 2.5rem',
                background: 'linear-gradient(to-r, #ec4899, #f97316)',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '1.125rem',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
              }}
            >
              Book Your Adventure Now
            </motion.button>
          </VStack>
        </Container>
      </Box>

      {/* Social Media Videos Section - Only shows if videos exist */}
      <SocialMediaVideos />

      {/* SEO: Hidden blog articles for search engine indexing */}
      <Box display={{ base: 'none' }} h={0} w={0} overflow="hidden">
        {blogArticles[locale]?.map((article) => (
          <Box as="article" key={article.id} data-article-id={article.slug}>
            <Heading size="md">{article.title}</Heading>
            {article.tour && <Text>Related tour: {article.tour}</Text>}
            {article.date && <time dateTime={article.date}>{article.date}</time>}
            <Text>{article.post}</Text>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Home;
