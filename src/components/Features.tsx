import React from 'react';
import { FormattedMessage } from 'react-intl';
import { MdSecurityUpdateGood, MdElectricBolt, MdDirectionsBus } from 'react-icons/md';
import { motion } from 'framer-motion';
import { Box, VStack, Heading, Text, Container, SimpleGrid, Icon } from '@chakra-ui/react';

const Features = () => {
  const features = [
    {
      icon: MdSecurityUpdateGood,
      color: 'teal.700',
      title: 'features.safety.title',
      text: 'features.safety.description',
    },
    {
      icon: MdElectricBolt,
      color: 'blue.700',
      title: 'features.experiences.title',
      text: 'features.experiences.description',
    },
    {
      icon: MdDirectionsBus,
      color: 'amber.600',
      title: 'features.transportation.title',
      text: 'features.transportation.description',
    },
  ];

  return (
    <Box as="section" py={{ base: 16, md: 20 }}>
      <Container maxW="6xl" px={{ base: 4, md: 8 }}>
        <VStack mb={{ base: 12, md: 14 }} textAlign="center">
          <Heading as="h2" fontSize={{ base: '4xl', md: '5xl' }} fontWeight="bold" color="slate.900">
            <FormattedMessage id="features.title" />
          </Heading>
        </VStack>
        
        <SimpleGrid columns={{ base: 1, md: 3 }} gap={{ base: 6, lg: 8 }}>
          {features.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
            >
              <Box
                as="article"
                p={8}
                borderRadius="3xl"
                bg="whiteAlpha.700"
                backdropFilter="blur(12px)"
                border="1px solid"
                borderColor="whiteAlpha.500"
                boxShadow="0 24px 64px rgba(8,42,62,0.18)"
                textAlign="center"
                transition="all 0.3s"
                _hover={{
                  boxShadow: '0 36px 100px rgba(8,42,62,0.24)',
                }}
              >
                <VStack spacing={5} align="center">
                  <Box
                    h={20}
                    w={20}
                    borderRadius="full"
                    bg="white"
                    boxShadow="md"
                    display="grid"
                    placeItems="center"
                  >
                    <Icon as={item.icon} boxSize={10} color={item.color} />
                  </Box>
                  <Heading as="h3" size="xl" fontWeight="bold" color="slate.900">
                    <FormattedMessage id={item.title} />
                  </Heading>
                  <Text color="slate.600" lineHeight="tall">
                    <FormattedMessage id={item.text} />
                  </Text>
                </VStack>
              </Box>
            </motion.div>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
};

export default Features;
