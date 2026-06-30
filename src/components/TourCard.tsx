import React, { useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
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
  Input,
} from '@chakra-ui/react';
import { FormControl, FormLabel } from '@chakra-ui/form-control';
import { generateWhatsAppMessage } from '../utils/whatsapp';
import { useBrand } from '../contexts/BrandContext';
import { PricingOption } from '../services/toursService';
import MarkdownRenderer from './ui/MarkdownRenderer';

interface TourCardProps {
  image: string;
  title: string;
  description: string;
  price: string;
  pricingOptions?: PricingOption[];
  excursionName: string;
  detailsPath: string;
  enabled?: boolean;
  showPrice?: boolean;
  showDetailsLink?: boolean;
}

const buildPaymentHref = (baseLink: string, amount: number | null): string => {
  const trimmedLink = String(baseLink ?? '').trim();

  if (!trimmedLink || !amount) {
    return '';
  }

  const normalizedBase = trimmedLink.replace(/\/$/, '').replace(/\/\d+(?:\.\d+)?$/, '');
  return `${normalizedBase}/${amount}`;
};

const TourCard: React.FC<TourCardProps> = ({
  image,
  title,
  description,
  price,
  pricingOptions = [],
  excursionName,
  detailsPath,
  enabled = true,
  showPrice = true,
  showDetailsLink = true,
}) => {
  const intl = useIntl();
  const { brandSettings } = useBrand();
  const resolvedPricingOptions = pricingOptions.length > 0
    ? pricingOptions
    : [{ tier: intl.locale === 'es' ? 'Personas' : 'People', price, amount: null }];
  const [selectedDate, setSelectedDate] = useState('');
  const [quantities, setQuantities] = useState<Record<string, number>>(() =>
    resolvedPricingOptions.reduce<Record<string, number>>((accumulator, option, index) => {
      accumulator[option.tier] = index === 0 ? 1 : 0;
      return accumulator;
    }, {})
  );

  const totalAmount = useMemo(
    () =>
      resolvedPricingOptions.reduce((sum, option) => {
        const quantity = quantities[option.tier] ?? 0;
        return sum + (option.amount ?? 0) * quantity;
      }, 0),
    [quantities, resolvedPricingOptions]
  );

  const selectedQuantitySummary = resolvedPricingOptions
    .filter((option) => (quantities[option.tier] ?? 0) > 0)
    .map((option) => `${option.tier}: ${quantities[option.tier]}`)
    .join(', ');

  const paypalHref = useMemo(
    () => buildPaymentHref(brandSettings.paypalMeLink, totalAmount || null),
    [brandSettings.paypalMeLink, totalAmount]
  );
  const verifoneHref = useMemo(
    () => buildPaymentHref(brandSettings.verifoneLink, totalAmount || null),
    [brandSettings.verifoneLink, totalAmount]
  );

  const formattedSelectedDate = selectedDate
    ? new Intl.DateTimeFormat(intl.locale === 'es' ? 'es-DO' : 'en-US', {
      dateStyle: 'full',
    }).format(new Date(`${selectedDate}T00:00:00`))
    : '';

  const handleQuantityChange = (tier: string, nextValue: string) => {
    const parsedValue = Math.max(0, Number(nextValue) || 0);
    setQuantities((current) => ({ ...current, [tier]: parsedValue }));
  };

  const handleBookNow = () => {
    let message = '';
    message += `Hello, I want to book ${excursionName}\n`;
    message += `Participants: ${selectedQuantitySummary || 'N/A'}\n`;
    message += `Preferred date: ${formattedSelectedDate || 'Not specified'}\n`;
    message += `Price: ${totalAmount > 0 ? totalAmount : price} USD`;
    message += `\n`;
    message += `Hola, deseo reservar el ${excursionName}\n`;
    message += `Participantes: ${selectedQuantitySummary || 'N/A'}\n`;
    message += `Fecha preferida: ${formattedSelectedDate || 'No especificada'}\n`;
    message += `Precio: ${totalAmount > 0 ? totalAmount : price} USD`;

    const whatsappUrl = generateWhatsAppMessage(brandSettings.phoneNumber, message);

    if (whatsappUrl) {
      window.open(whatsappUrl, '_blank');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
    >
      <Box
        as="article"
        h="full"
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        overflow="hidden"
        borderRadius="3xl"
        bg="whiteAlpha.700"
        backdropFilter="blur(12px)"
        border="1px solid"
        borderColor="whiteAlpha.500"
        boxShadow="0 24px 64px rgba(8,42,62,0.18)"
        _hover={{
          boxShadow: '0 36px 100px rgba(8,42,62,0.24)',
          transform: 'translateY(-8px)',
        }}
        transition="all 0.3s"
      >
        <Box position="relative">
          <Link to={detailsPath}>
            <Image
              src={image}
              alt={title}
              h="224px"
              w="full"
              objectFit="cover"
              transition="transform 0.5s"
              sx={{
                '&:hover': { transform: 'scale(1.05)' },
              }}
            />
          </Link>
        </Box>

        <VStack p={6} spacing={5} align="stretch">
          <HStack justify="space-between" gap={3}>
            <Heading as="h3" size="xl" color="slate.900">
              {title}
            </Heading>
            {showDetailsLink && (
              <Link to={detailsPath}>
                <Text fontSize="sm" fontWeight="semibold" color="teal.700" _hover={{ color: 'teal.900' }}>
                  <FormattedMessage id="details.view" defaultMessage="View details" />
                </Text>
              </Link>
            )}
          </HStack>
          
          <MarkdownRenderer content={description} />

          {showPrice && (
            <HStack wrap="wrap" gap={2}>
              {resolvedPricingOptions.map((option) => (
                <Badge
                  key={`${title}-${option.tier}`}
                  borderRadius="full"
                  bg="slate.100"
                  px={3}
                  py={1}
                  fontSize="sm"
                  fontWeight="semibold"
                  color="slate.700"
                >
                  {option.tier}: {option.price}
                </Badge>
              ))}
            </HStack>
          )}

          {enabled && (
            <>
              <VStack spacing={3}>
                {resolvedPricingOptions.map((option) => (
                  <FormControl key={option.tier}>
                    <FormLabel fontSize="sm" fontWeight="semibold" color="slate.700">
                      {option.tier}
                    </FormLabel>
                    <Input
                      type="number"
                      min="0"
                      value={quantities[option.tier] ?? 0}
                      onChange={(event) => handleQuantityChange(option.tier, event.target.value)}
                      borderRadius="xl"
                      borderColor="slate.200"
                      bg="white"
                      _focus={{ borderColor: 'teal.500' }}
                    />
                  </FormControl>
                ))}
              </VStack>

              <FormControl>
                <FormLabel fontSize="sm" fontWeight="medium" color="slate.700">
                  <FormattedMessage id="tours.dateLabel" defaultMessage="Select your preferred date" />
                </FormLabel>
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(event) => setSelectedDate(event.target.value)}
                  borderRadius="2xl"
                  borderColor="slate.200"
                  bg="white"
                  px={4}
                  py={3}
                  boxShadow="sm"
                  _focus={{ borderColor: 'teal.500', ring: 2, ringColor: 'teal.200' }}
                />
              </FormControl>

              <Box
                borderRadius="2xl"
                bg="teal.50"
                px={4}
                py={3}
                fontSize="sm"
                fontWeight="semibold"
                color="teal.900"
              >
                <FormattedMessage id="payment.total" defaultMessage="Payment total" />:{' '}
                {totalAmount > 0 ? `$${totalAmount}` : price}
              </Box>

              <VStack spacing={3}>
                <Button
                  onClick={handleBookNow}
                  w="full"
                  bgGradient="linear(to-r, teal.600, cyan.500)"
                  color="white"
                  fontWeight="semibold"
                  borderRadius="xl"
                  _hover={{ boxShadow: 'lg', transform: 'translateY(-2px)' }}
                  transition="all 0.2s"
                >
                  <FormattedMessage id="tours.bookNow" />
                </Button>
                <HStack w="full" spacing={3}>
                  {paypalHref && (
                    <Button
                      as="a"
                      href={paypalHref}
                      target="_blank"
                      rel="noreferrer"
                      w="full"
                      variant="outline"
                      borderColor="teal.600"
                      color="teal.700"
                      borderRadius="xl"
                      _hover={{ bg: 'teal.50' }}
                    >
                      <FormattedMessage id="payment.paypal" defaultMessage="Pay with PayPal" />
                    </Button>
                  )}
                  {verifoneHref && (
                    <Button
                      as="a"
                      href={verifoneHref}
                      target="_blank"
                      rel="noreferrer"
                      w="full"
                      variant="outline"
                      borderColor="teal.600"
                      color="teal.700"
                      borderRadius="xl"
                      _hover={{ bg: 'teal.50' }}
                    >
                      <FormattedMessage id="payment.verifone" defaultMessage="Pay with Verifone" />
                    </Button>
                  )}
                </HStack>
              </VStack>
            </>
          )}
        </VStack>
      </Box>
    </motion.div>
  );
};

export default TourCard;
