import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { motion } from 'framer-motion';
import {
  Box,
  Flex,
  VStack,
  HStack,
  Text,
  Heading,
  Button,
  Input,
  Textarea,
  Select,
  Checkbox,
  useBreakpointValue,
  Badge,
  Alert,
  Divider,
  Spinner,
  SimpleGrid,
} from '@chakra-ui/react';
import { AlertIcon } from '@chakra-ui/alert';
import { getTransferConfig } from '../services/transferConfigService';
import { calculateDistancePrice } from '../services/transferPricingEngine';
import { getRouteBetweenPoints } from '../services/routingService';
import { detectMunicipio } from '../services/municipioService';
import { TransferConfig, TransferFormData, TransferPriceResult } from '../types/transport';
import { useI18n } from '../contexts/I18nContext';
import { useBrand } from '../contexts/BrandContext';
import { useMap } from '../contexts/MapContext';
import PlaceAutocomplete from '../components/PlaceAutocomplete';
import DateTimePicker from '../components/ui/DateTimePicker';
import MobileNumberPicker from '../components/ui/MobileNumberPicker';
import RouteMap from '../components/RouteMap';

type TripType = 'one-way' | 'round-trip';

const initialFormState: TransferFormData = {
  vehicleKey: '',
  passengers: 1,
  roundTrip: false,
  nightTransfer: false,
  waitingHours: 0,
  childSeats: 0,
};

function digitsOnly(value: string): string {
  return value.replace(/\D/g, '');
}

const Transport: React.FC = () => {
  const { locale } = useI18n();
  const { brandSettings } = useBrand();
  const { available: mapsAvailable } = useMap();

  const [config, setConfig] = useState<TransferConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<TransferFormData>(initialFormState);
  const [tripType, setTripType] = useState<TripType>('round-trip');
  const [priceResult, setPriceResult] = useState<TransferPriceResult | null>(null);
  const [priceError, setPriceError] = useState<string | null>(null);

  const [originAddress, setOriginAddress] = useState('');
  const [destAddress, setDestAddress] = useState('');
  const [originLatLng, setOriginLatLng] = useState<{ lat: number; lng: number } | null>(null);
  const [destLatLng, setDestLatLng] = useState<{ lat: number; lng: number } | null>(null);
  const [routeGeometry, setRouteGeometry] = useState<[number, number][] | null>(null);

  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [returnTime, setReturnTime] = useState('');
  const [flightNumber, setFlightNumber] = useState('');
  const [hotelName, setHotelName] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const cfg = await getTransferConfig();
        setConfig(cfg);
        if (cfg.vehicleTypes.length > 0) {
          setForm((prev) => ({ ...prev, vehicleKey: cfg.vehicleTypes[0].key }));
        }
      } catch (err) {
        console.error('Failed to load transfer config', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    setForm((prev) => ({ ...prev, roundTrip: tripType === 'round-trip' }));
  }, [tripType]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (!config || !form.vehicleKey) {
        setPriceResult(null);
        setPriceError(null);
        return;
      }

      try {
        let distanceKm: number | null = null;
        let durationMinutes = 0;
        const originLabel = originAddress || '';
        const destinationLabel = destAddress || '';
        setRouteGeometry(null);

        if (originLatLng && destLatLng) {
          const route = await getRouteBetweenPoints(originLatLng, destLatLng);
          if (cancelled) return;
          distanceKm = route.distanceKm;
          durationMinutes = route.durationMinutes;
          setRouteGeometry(route.geometry);
        }

        if (distanceKm == null) {
          setPriceResult(null);
          setPriceError('Please select both pickup and drop-off (precise locations preferred)');
          return;
        }

        const result = calculateDistancePrice(config, distanceKm, durationMinutes, originLabel || 'Origin', destinationLabel || 'Destination', form);
        if (cancelled) return;
        setPriceResult(result);
        setPriceError(null);
      } catch (err) {
        if (cancelled) return;
        setPriceResult(null);
        setPriceError(err instanceof Error ? err.message : 'Calculation error');
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [config, form, originLatLng, destLatLng, originAddress, destAddress]);

  const selectedVehicle = useMemo(
    () => config?.vehicleTypes.find((v) => v.key === form.vehicleKey),
    [config, form.vehicleKey]
  );

  const handlePassengerChange = useCallback((value: number) => {
    setForm((prev) => ({ ...prev, passengers: Math.max(1, Math.min(100, value)) }));
  }, []);

  const needsTwoVehicles = useMemo(() => {
    if (!selectedVehicle) return false;
    const threshold = selectedVehicle.passengerThreshold ?? (selectedVehicle.maxPassengers + 1);
    return form.passengers > threshold;
  }, [selectedVehicle, form.passengers]);

  const waPhone = useMemo(() => {
    const raw = brandSettings.phoneNumber || '+18299999999';
    return digitsOnly(raw);
  }, [brandSettings.phoneNumber]);

  const formatPrice = (price: number) => `USD ${price}`;
  const formatDuration = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h > 0 ? `${h}h ` : ''}${m}m`;
  };

  const buildWhatsAppMessage = useCallback(() => {
    if (!priceResult) return '';

    const baseMsg = locale === 'es'
      ? `Hola, quiero reservar un traslado:\n\n`
      : `Hello, I'd like to book a transfer:\n\n`;

    const details = [
      `${locale === 'es' ? 'Desde' : 'From'}: ${priceResult.originLabel}`,
      ...(priceResult.originMunicipio ? [`${locale === 'es' ? 'Municipio origen' : 'Origin municipio'}: ${priceResult.originMunicipio}`] : []),
      `${locale === 'es' ? 'Hasta' : 'To'}: ${priceResult.destinationLabel}`,
      ...(priceResult.destinationMunicipio ? [`${locale === 'es' ? 'Municipio destino' : 'Destination municipio'}: ${priceResult.destinationMunicipio}`] : []),
      `${locale === 'es' ? 'Vehículo' : 'Vehicle'}: ${priceResult.vehicleLabel}`,
      `${locale === 'es' ? 'Pasajeros' : 'Passengers'}: ${form.passengers}`,
      `${locale === 'es' ? 'Tipo' : 'Trip'}: ${tripType === 'round-trip' ? (locale === 'es' ? 'Ida y Vuelta' : 'Round Trip') : (locale === 'es' ? 'Solo Ida' : 'One Way')}`,
      `${locale === 'es' ? 'Salida' : 'Departure'}: ${departureDate}${departureTime ? ` ${departureTime}` : ''}`,
    ];

    if (originAddress) details.push(`📍 ${locale === 'es' ? 'Origen' : 'Origin'}: ${originAddress}`);
    if (destAddress) details.push(`📍 ${locale === 'es' ? 'Destino' : 'Destination'}: ${destAddress}`);
    if (tripType === 'round-trip' && returnDate) {
      details.push(`${locale === 'es' ? 'Regreso' : 'Return'}: ${returnDate}${returnTime ? ` ${returnTime}` : ''}`);
    }
    if (flightNumber) details.push(`${locale === 'es' ? 'Vuelo' : 'Flight'}: ${flightNumber}`);
    if (hotelName) details.push(`${locale === 'es' ? 'Hotel' : 'Hotel'}: ${hotelName}`);
    if (streetAddress) details.push(`${locale === 'es' ? 'Dirección' : 'Address'}: ${streetAddress}`);
    if (form.childSeats > 0) details.push(`${locale === 'es' ? 'Sillas infantiles' : 'Child seats'}: ${form.childSeats}`);
    if (form.waitingHours > 0) details.push(`${locale === 'es' ? 'Espera' : 'Waiting'}: ${form.waitingHours}h`);
    if (form.nightTransfer) details.push(locale === 'es' ? '🌙 Traslado nocturno' : '🌙 Night transfer');
    if (notes) details.push(`${locale === 'es' ? 'Notas' : 'Notes'}: ${notes}`);

    details.push(`\n💰 ${locale === 'es' ? 'Total estimado' : 'Estimated total'}: USD ${priceResult.estimatedPrice}`);

    return `${baseMsg}${details.join('\n')}`;
  }, [priceResult, form, tripType, departureDate, returnDate, departureTime, returnTime, flightNumber, hotelName, streetAddress, notes, locale, originAddress, destAddress]);

  const handleBookNow = useCallback(() => {
    const msg = buildWhatsAppMessage();
    if (!msg) return;
    window.open(`https://wa.me/${waPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  }, [buildWhatsAppMessage, waPhone]);

  const handleChatOnWhatsApp = useCallback(() => {
    const details = [
      `${locale === 'es' ? 'Desde' : 'From'}: ${priceResult?.originLabel ?? ''}`,
      `${locale === 'es' ? 'Hasta' : 'To'}: ${priceResult?.destinationLabel ?? ''}`,
      `${locale === 'es' ? 'Vehículo' : 'Vehicle'}: ${priceResult?.vehicleLabel ?? ''}`,
      `${locale === 'es' ? 'Pasajeros' : 'Passengers'}: ${form.passengers}`,
    ];
    if (hotelName) details.push(`${locale === 'es' ? 'Hotel' : 'Hotel'}: ${hotelName}`);
    if (departureDate) details.push(`${locale === 'es' ? 'Fecha' : 'Date'}: ${departureDate}`);

    const interestLine = details.join('\n');

    const msg = locale === 'es'
      ? `Hola, estoy interesado/a en reservar un traslado:\n\n${interestLine}\n\nTengo una consulta y quisiera asegurarme de algo. ¿Estás disponible?`
      : `Hi, I'm interested in booking a transfer:\n\n${interestLine}\n\nI have a question and would like to double-check something. Are you available?`;

    window.open(`https://wa.me/${waPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  }, [priceResult, form, hotelName, departureDate, locale, waPhone]);

  const handlePayWithPayPal = useCallback(() => {
    if (!priceResult) return;
    const total = priceResult.estimatedPrice;
    const paypalUrl = brandSettings.paypalMeLink || 'https://www.paypal.com/paypalme/carlostours';
    const separator = paypalUrl.endsWith('/') ? '' : '/';
    const url = total > 0 ? `${paypalUrl}${separator}${total}` : paypalUrl;
    window.open(url, '_blank');
  }, [priceResult, brandSettings.paypalMeLink]);

  const handleOriginSelect = useCallback((place: { placeId: string; address: string; lat: number; lng: number }) => {
    setOriginAddress(place.address);
    setOriginLatLng({ lat: place.lat, lng: place.lng });
    
    // Detect municipio from coordinates
    (async () => {
      const municipio = await detectMunicipio(place.lat, place.lng);
      if (municipio) {
        setForm((prev) => ({ ...prev, originMunicipio: municipio }));
      }
    })();
  }, []);

  const handleDestSelect = useCallback((place: { placeId: string; address: string; lat: number; lng: number }) => {
    setDestAddress(place.address);
    setDestLatLng({ lat: place.lat, lng: place.lng });
    
    // Detect municipio from coordinates
    (async () => {
      const municipio = await detectMunicipio(place.lat, place.lng);
      if (municipio) {
        setForm((prev) => ({ ...prev, destinationMunicipio: municipio }));
      }
    })();
  }, []);

  if (loading) {
    return (
      <Flex minH="100vh" justify="center" align="center">
        <Spinner size="xl" color="brand.orange" />
      </Flex>
    );
  }

  return (
    <Box minH="100vh" bgGradient="linear(to-b, cyan.50, white, amber.50)" pb={16} pt={6} mdPy={16}>
      <Box maxW="5xl" mx="auto" px={{ base: 3, md: 4 }}>
        <Box mb={{ base: 6, md: 10 }} textAlign="center">
          <Heading as="h1" mb={3} fontSize={{ base: '3xl', md: '5xl' }} fontWeight="bold" color="slate.900">
            <FormattedMessage id="transport.title" defaultMessage="Airport Transfers" />
          </Heading>
          <Text maxW="2xl" mx="auto" fontSize={{ base: 'base', md: 'lg' }} color="slate.600">
            <FormattedMessage
              id="transport.subtitle"
              defaultMessage="Private transfers from Punta Cana Airport (PUJ) to any destination. Reliable, comfortable, and affordable."
            />
          </Text>
        </Box>

        {!mapsAvailable && (
          <Alert status="warning" mb={4} borderRadius="2xl" px={4} py={3}>
            <AlertIcon />
            <Text fontSize="sm" color="amber.700">
              ⚠️ Map services unavailable. Enter your pickup/drop-off manually below.
            </Text>
          </Alert>
        )}

        {!config ? (
          <Alert status="error" borderRadius="3xl" p={8} textAlign="center">
            <Text color="red.700">
              <FormattedMessage id="transport.configError" defaultMessage="Unable to load transfer configuration. Please try again later." />
            </Text>
          </Alert>
        ) : (
          <Flex direction={{ base: 'column', lg: 'row' }} gap={{ base: 6, lg: 8 }}>
            <VStack flex="1" spacing={{ base: 5, md: 6 }} align="stretch">
              <Box borderRadius="2xl" bg="white" p={{ base: 4, md: 6 }} shadow="lg">
                <Heading size="md" mb={4} color="slate.800">
                  📍 <FormattedMessage id="transport.pickupDropoff" defaultMessage="Pickup & Drop-off" />
                </Heading>
                <VStack spacing={4}>
                  <Box w="full">
                    <Text mb={1.5} fontSize="xs" fontWeight="medium" color="slate.500">
                      <FormattedMessage id="transport.origin" defaultMessage="Pickup location" />
                    </Text>
                    <PlaceAutocomplete
                      placeholder={locale === 'es' ? 'Ej: Hotel, aeropuerto, dirección...' : 'e.g. Hotel, airport, address...'}
                      value={originAddress}
                      onPlaceSelect={handleOriginSelect}
                      onClear={() => {
                        setOriginAddress('');
                        setOriginLatLng(null);
                        setForm((prev) => ({ ...prev, originMunicipio: undefined }));
                      }}
                    />
                    {form.originMunicipio && (
                      <Badge mt={2} colorScheme="teal" borderRadius="full" px={3} py={1} fontSize="xs" fontWeight="semibold">
                        📍 {locale === 'es' ? 'Municipio origen' : 'Origin municipio'}: {form.originMunicipio}
                      </Badge>
                    )}
                  </Box>

                  {priceResult && (
                    <Flex mt={3} borderRadius="lg" bg="slate.50" px={3} py={2} fontSize="sm" color="slate.700" justify="space-between" align="center">
                      <HStack gap={3}>
                        <Text>📏</Text>
                        <Text fontWeight="medium">{priceResult.distanceKm.toFixed(1)} km • {(priceResult.distanceKm * 0.621371).toFixed(1)} mi</Text>
                      </HStack>
                      <HStack gap={3}>
                        <Text>🕒</Text>
                        <Text fontWeight="medium">{formatDuration(priceResult.durationMinutes)}</Text>
                      </HStack>
                    </Flex>
                  )}

                  <Flex justify="center">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        const tmpAddr = originAddress;
                        const tmpLatLng = originLatLng;
                        const tmpMunicipio = form.originMunicipio;

                        setOriginAddress(destAddress);
                        setOriginLatLng(destLatLng);
                        setForm((prev) => ({ ...prev, originMunicipio: form.destinationMunicipio }));

                        setDestAddress(tmpAddr);
                        setDestLatLng(tmpLatLng);
                        setForm((prev) => ({ ...prev, destinationMunicipio: tmpMunicipio }));
                      }}
                      style={{
                        height: '36px',
                        width: '36px',
                        display: 'grid',
                        placeItems: 'center',
                        borderRadius: '9999px',
                        backgroundColor: '#f1f5f9',
                        color: '#64748b',
                      }}
                      aria-label="Swap origin and destination"
                    >
                      ⇅
                    </motion.button>
                  </Flex>

                  <Box w="full">
                    <Text mb={1.5} fontSize="xs" fontWeight="medium" color="slate.500">
                      <FormattedMessage id="transport.destination" defaultMessage="Drop-off location" />
                    </Text>
                    <PlaceAutocomplete
                      placeholder={locale === 'es' ? 'Ej: Hotel, dirección, lugar turístico...' : 'e.g. Hotel, address, landmark...'}
                      value={destAddress}
                      onPlaceSelect={handleDestSelect}
                      onClear={() => {
                        setDestAddress('');
                        setDestLatLng(null);
                        setForm((prev) => ({ ...prev, destinationMunicipio: undefined }));
                      }}
                    />
                    {form.destinationMunicipio && (
                      <Badge mt={2} colorScheme="amber" borderRadius="full" px={3} py={1} fontSize="xs" fontWeight="semibold">
                        📍 {form.destinationMunicipio}
                      </Badge>
                    )}
                  </Box>
                </VStack>
              </Box>

              <Box borderRadius="2xl" bg="white" p={{ base: 4, md: 6 }} shadow="lg">
                <Text mb={3} fontSize="sm" fontWeight="semibold" color="slate.700">
                  <FormattedMessage id="transport.tripType" defaultMessage="Trip Type" />
                </Text>
                <HStack gap={3}>
                  <Button
                    flex="1"
                    borderRadius="xl"
                    px={4}
                    py={4}
                    fontSize="base"
                    fontWeight="semibold"
                    bg={tripType === 'round-trip' ? 'teal.600' : 'slate.100'}
                    color={tripType === 'round-trip' ? 'white' : 'slate.600'}
                    _hover={{ bg: tripType === 'round-trip' ? 'teal.700' : 'slate.200' }}
                    onClick={() => setTripType('round-trip')}
                  >
                    🔄 <FormattedMessage id="transport.roundTrip" defaultMessage="Round Trip" />
                  </Button>
                  <Button
                    flex="1"
                    borderRadius="xl"
                    px={4}
                    py={4}
                    fontSize="base"
                    fontWeight="semibold"
                    bg={tripType === 'one-way' ? 'teal.600' : 'slate.100'}
                    color={tripType === 'one-way' ? 'white' : 'slate.600'}
                    _hover={{ bg: tripType === 'one-way' ? 'teal.700' : 'slate.200' }}
                    onClick={() => setTripType('one-way')}
                  >
                    ➡️ <FormattedMessage id="transport.oneWay" defaultMessage="One Way" />
                  </Button>
                </HStack>
              </Box>

              <Box borderRadius="2xl" bg="white" p={{ base: 4, md: 6 }} shadow="lg">
                <Heading size="md" mb={4} color="slate.800">
                  📅 <FormattedMessage id="transport.dateTime" defaultMessage="Date & Time" />
                </Heading>
                <SimpleGrid columns={{ base: 1, sm: 2 }} gap={4}>
                  <DateTimePicker
                    type="date"
                    value={departureDate}
                    onChange={setDepartureDate}
                    label={locale === 'es' ? 'Fecha de Salida' : 'Departure Date'}
                  />
                  <DateTimePicker
                    type="time"
                    value={departureTime}
                    onChange={setDepartureTime}
                    label={locale === 'es' ? 'Hora de Salida' : 'Departure Time'}
                  />
                  {tripType === 'round-trip' && (
                    <>
                      <DateTimePicker
                        type="date"
                        value={returnDate}
                        onChange={setReturnDate}
                        label={locale === 'es' ? 'Fecha de Regreso' : 'Return Date'}
                      />
                      <DateTimePicker
                        type="time"
                        value={returnTime}
                        onChange={setReturnTime}
                        label={locale === 'es' ? 'Hora de Regreso' : 'Return Time'}
                      />
                    </>
                  )}
                </SimpleGrid>
              </Box>

              <Box borderRadius="2xl" bg="white" p={{ base: 4, md: 6 }} shadow="lg">
                <Heading size="md" mb={4} color="slate.800">
                  🚗 <FormattedMessage id="transport.vehicleAndPassengers" defaultMessage="Vehicle & Passengers" />
                </Heading>
                <SimpleGrid columns={{ base: 1, sm: 2 }} gap={4}>
                  <Box>
                    <Text mb={1.5} fontSize="xs" fontWeight="medium" color="slate.500">
                      <FormattedMessage id="transport.vehicleType" defaultMessage="Vehicle Type" />
                    </Text>
                    <Select
                      value={form.vehicleKey}
                      onChange={(e) => setForm((prev) => ({ ...prev, vehicleKey: e.target.value }))}
                      borderRadius="2xl"
                      borderColor="slate.200"
                      bg="white"
                      px={4}
                      py={4}
                      fontSize="base"
                      _focus={{ borderColor: 'teal.500', ring: 2, ringColor: 'teal.200' }}
                    >
                      {config.vehicleTypes.map((vt) => (
                        <option key={vt.key} value={vt.key}>
                          {vt.label} (≤{vt.maxPassengers} pax)
                        </option>
                      ))}
                    </Select>
                  </Box>
                  <MobileNumberPicker
                    value={form.passengers}
                    onChange={handlePassengerChange}
                    min={1}
                    max={100}
                    step={1}
                    label={locale === 'es' ? 'Pasajeros' : 'Passengers'}
                    ariaLabel="passengers"
                  />
                </SimpleGrid>
                {selectedVehicle && (
                  <VStack mt={3} spacing={2} align="stretch">
                    <Text fontSize="sm" color="slate.600">
                      <FormattedMessage
                        id="transport.vehicleCapacity"
                        defaultMessage="Capacity: {min}–{max} passengers"
                        values={{ min: selectedVehicle.typicalPassengers[0], max: selectedVehicle.typicalPassengers[1] }}
                      />
                    </Text>
                    <Text fontSize="xs" color="slate.400">{selectedVehicle.description}</Text>
                    {selectedVehicle.image && (
                      <Box mt={2} h={{ base: 28, md: 36 }} w="full" overflow="hidden" borderRadius="xl" bg="slate.100">
                        <Box as="img" src={selectedVehicle.image} alt={selectedVehicle.label} h="full" w="full" objectFit="cover" />
                      </Box>
                    )}
                    {needsTwoVehicles && (
                      <Flex align="center" gap={1} borderRadius="lg" bg="amber.50" px={3} py={2} color="amber.700">
                        <Text>⚠️</Text>
                        <FormattedMessage
                          id="transport.twoVehiclesNeeded"
                          defaultMessage="Double price applied: passenger count exceeds typical capacity"
                        />
                      </Flex>
                    )}
                  </VStack>
                )}
              </Box>

              <Box borderRadius="2xl" bg="white" p={{ base: 4, md: 6 }} shadow="lg">
                <Heading size="md" mb={4} color="slate.800">
                  ⚙️ <FormattedMessage id="transport.extras" defaultMessage="Extras" />
                </Heading>
                <SimpleGrid columns={{ base: 1, sm: 2 }} gap={4}>
                  <motion.label
                    whileTap={{ scale: 0.98 }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      padding: '16px',
                      transition: 'all 0.2s',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={form.nightTransfer}
                      onChange={(e) => setForm((prev) => ({ ...prev, nightTransfer: e.target.checked }))}
                      style={{
                        height: '20px',
                        width: '20px',
                        borderRadius: '4px',
                        borderColor: '#cbd5e1',
                        color: '#0d9488',
                      }}
                    />
                    <Text fontSize="sm" color="slate.700">
                      🌙 <FormattedMessage id="transport.nightTransfer" defaultMessage="Night Transfer" />
                    </Text>
                  </motion.label>
                  <MobileNumberPicker
                    value={form.waitingHours}
                    onChange={(v) => setForm((prev) => ({ ...prev, waitingHours: v ?? 0 }))}
                    min={0}
                    max={10}
                    step={1}
                    label={locale === 'es' ? 'Espera (horas)' : 'Waiting (hours)'}
                    ariaLabel="waiting hours"
                  />
                  <MobileNumberPicker
                    value={form.childSeats}
                    onChange={(v) => setForm((prev) => ({ ...prev, childSeats: v ?? 0 }))}
                    min={0}
                    max={10}
                    step={1}
                    label={locale === 'es' ? 'Sillas Infantiles' : 'Child Seats'}
                    ariaLabel="child seats"
                  />
                </SimpleGrid>
                {form.nightTransfer && (
                  <Text mt={2} fontSize="xs" color="amber.600">🌙 +15% night surcharge after 10 PM</Text>
                )}
              </Box>
              <Box borderRadius="2xl" bg="white" p={{ base: 4, md: 6 }} shadow="lg">
                <Heading size="md" mb={4} color="slate.800">
                  📋 <FormattedMessage id="transport.locationInfo" defaultMessage="Location Details" />
                </Heading>
                <SimpleGrid columns={{ base: 1, sm: 2 }} gap={4}>
                  <Box>
                    <Text mb={1.5} fontSize="xs" fontWeight="medium" color="slate.500">
                      <FormattedMessage id="transport.flightNumber" defaultMessage="Flight Number" />
                    </Text>
                    <Input
                      type="text"
                      inputMode="text"
                      value={flightNumber}
                      onChange={(e) => setFlightNumber(e.target.value)}
                      placeholder={locale === 'es' ? 'Ej: AA 1234' : 'e.g. AA 1234'}
                      borderRadius="2xl"
                      borderColor="slate.200"
                      px={4}
                      py={4}
                      fontSize="base"
                      _focus={{ borderColor: 'teal.500', outline: 'none', ring: 2, ringColor: 'teal.200' }}
                    />
                  </Box>
                  <Box>
                    <Text mb={1.5} fontSize="xs" fontWeight="medium" color="slate.500">
                      <FormattedMessage id="transport.hotelName" defaultMessage="Hotel / Resort" />
                    </Text>
                    <Input
                      type="text"
                      inputMode="text"
                      value={hotelName}
                      onChange={(e) => setHotelName(e.target.value)}
                      placeholder={locale === 'es' ? 'Ej: Iberostar' : 'e.g. Iberostar'}
                      borderRadius="2xl"
                      borderColor="slate.200"
                      px={4}
                      py={4}
                      fontSize="base"
                      _focus={{ borderColor: 'teal.500', outline: 'none', ring: 2, ringColor: 'teal.200' }}
                    />
                  </Box>
                  <Box gridColumn={{ sm: 'span 2' }}>
                    <Text mb={1.5} fontSize="xs" fontWeight="medium" color="slate.500">
                      <FormattedMessage id="transport.notes" defaultMessage="Notes" />
                    </Text>
                    <Textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder={locale === 'es' ? 'Requisitos especiales...' : 'Special requirements...'}
                      rows={3}
                      borderRadius="2xl"
                      borderColor="slate.200"
                      px={4}
                      py={4}
                      fontSize="base"
                      _focus={{ borderColor: 'teal.500', outline: 'none', ring: 2, ringColor: 'teal.200' }}
                    />
                  </Box>
                </SimpleGrid>
              </Box>
            </VStack>

            <Box w="full" lgW="80" xlW="96">
              <VStack position="sticky" top={24} spacing={{ base: 5, md: 6 }}>
                <Box borderRadius="2xl" bg="white" p={{ base: 5, md: 6 }} shadow="lg">
                  <Heading size="md" mb={4} color="slate.800">
                    💰 <FormattedMessage id="transport.priceSummary" defaultMessage="Price Summary" />
                  </Heading>

                  {priceError && (
                    <Alert status="error" mb={4} borderRadius="xl" px={4} py={4}>
                      <Text fontSize="sm" color="red.700">{priceError}</Text>
                    </Alert>
                  )}

                  {priceResult && !priceError && (
                    <VStack spacing={4}>
                      <Box textAlign="center">
                        <Text fontSize="3xl" fontWeight="bold" color="teal.700">{formatPrice(priceResult.estimatedPrice)}</Text>
                        <Text fontSize="xs" color="slate.500">
                          <FormattedMessage id="transport.estimatedPrice" defaultMessage="Estimated total price" />
                        </Text>
                        <Text mt={1} fontSize="sm" color="slate.600">
                          {tripType === 'round-trip' ? (
                            <FormattedMessage id="transport.roundTripIncluded" defaultMessage="Round trip (both ways)" />
                          ) : (
                            <FormattedMessage id="transport.oneWayTrip" defaultMessage="One way transfer" />
                          )}
                        </Text>
                      </Box>

                      <VStack spacing={2} borderTopWidth={1} borderColor="slate.100" pt={4} fontSize="sm" color="slate.600" align="stretch">
                        <Flex justify="space-between">
                          <Text><FormattedMessage id="transport.origin" defaultMessage="From" /></Text>
                          <Text fontWeight="medium">{priceResult.originLabel}</Text>
                        </Flex>
                        {priceResult.originMunicipio && (
                          <Flex justify="space-between" align="center" color="teal.700">
                            <Text>📍 <FormattedMessage id="transport.originMunicipio" defaultMessage="Origin municipio" /></Text>
                            <Text fontWeight="semibold">{priceResult.originMunicipio}</Text>
                          </Flex>
                        )}
                        <Flex justify="space-between">
                          <Text><FormattedMessage id="transport.destination" defaultMessage="To" /></Text>
                          <Text fontWeight="medium">{priceResult.destinationLabel}</Text>
                        </Flex>
                        {priceResult.destinationMunicipio && (
                          <Flex justify="space-between" align="center" color="amber.700">
                            <Text>📍 <FormattedMessage id="transport.destMunicipio" defaultMessage="Destination municipio" /></Text>
                            <Text fontWeight="semibold">{priceResult.destinationMunicipio}</Text>
                          </Flex>
                        )}
                        {priceResult.breakdown.municipioMultiplierApplied && priceResult.breakdown.municipioMultiplierApplied !== 1.0 && (
                          <Flex justify="space-between" align="center" borderRadius="lg" bg="teal.50" px={2} py={2} color="teal.700" fontWeight="semibold" border="1px solid" borderColor="teal.100">
                            <Text>🏘️ <FormattedMessage id="transport.municipioMultiplier" defaultMessage="Municipio multiplier" /></Text>
                            <Text fontSize="lg">{priceResult.breakdown.municipioMultiplierApplied.toFixed(2)}×</Text>
                          </Flex>
                        )}
                        <Flex justify="space-between">
                          <Text><FormattedMessage id="transport.vehicle" defaultMessage="Vehicle" /></Text>
                          <Text fontWeight="medium">{priceResult.vehicleLabel}</Text>
                        </Flex>
                        <Flex justify="space-between">
                          <Text><FormattedMessage id="transport.passengers" defaultMessage="Passengers" /></Text>
                          <Text fontWeight="medium">{priceResult.passengers}</Text>
                        </Flex>
                        {priceResult.distanceKm !== undefined && (
                          <Flex justify="space-between">
                            <Text>📏 <FormattedMessage id="transport.distance" defaultMessage="Distance" /></Text>
                            <Text fontWeight="medium">{priceResult.distanceKm.toFixed(1)} km • {(priceResult.distanceKm * 0.621371).toFixed(1)} mi</Text>
                          </Flex>
                        )}
                        {priceResult.durationMinutes !== undefined && (
                          <Flex justify="space-between">
                            <Text>🕒 <FormattedMessage id="transport.duration" defaultMessage="Estimated travel time" /></Text>
                            <Text fontWeight="medium">{formatDuration(priceResult.durationMinutes)}</Text>
                          </Flex>
                        )}
                        {routeGeometry && (
                          <Box mt={3}>
                            <RouteMap origin={originLatLng ?? undefined} destination={destLatLng ?? undefined} geometry={routeGeometry} h="72" borderRadius="xl" border="1px solid" borderColor="slate.100" />
                          </Box>
                        )}
                        {form.nightTransfer && (
                          <Flex justify="space-between" color="amber.700">
                            <Text>🌙 <FormattedMessage id="transport.nightFee" defaultMessage="Night fee" /></Text>
                            <Text fontWeight="medium">+15%</Text>
                          </Flex>
                        )}
                        {priceResult.breakdown.distanceDiscountPercent !== undefined && priceResult.breakdown.distanceDiscountPercent > 0 && (
                          <Flex justify="space-between" color="teal.700">
                            <Text>🏷️ <FormattedMessage id="transport.distanceDiscount" defaultMessage="Distance discount" /></Text>
                            <Text fontWeight="medium">{priceResult.breakdown.distanceDiscountPercent}%</Text>
                          </Flex>
                        )}
                        {needsTwoVehicles && (
                          <Flex justify="space-between" color="amber.700">
                            <Text>🚗🚗 <FormattedMessage id="transport.doubleVehicle" defaultMessage="Double vehicle" /></Text>
                            <Text fontWeight="medium">×2</Text>
                          </Flex>
                        )}
                      </VStack>
                    </VStack>
                  )}

                  {!priceResult && !priceError && (
                    <Box py={8} textAlign="center">
                      <Text fontSize="sm" color="slate.400">
                        <FormattedMessage id="transport.fillFields" defaultMessage="Select pickup, drop-off, and vehicle to see the price" />
                      </Text>
                    </Box>
                  )}
                </Box>

                <VStack spacing={3}>
                  <Button
                    onClick={handleBookNow}
                    isDisabled={!priceResult || !!priceError}
                    w="full"
                    borderRadius="2xl"
                    px={6}
                    py={4}
                    fontSize="base"
                    fontWeight="bold"
                    color="white"
                    bg={priceResult && !priceError ? 'teal.600' : 'slate.300'}
                    _hover={{ bg: priceResult && !priceError ? 'teal.700' : 'slate.300' }}
                    _active={{ scale: 0.97 }}
                    shadow="lg"
                  >
                    📱 <FormattedMessage id="transport.bookNow" defaultMessage="Book via WhatsApp" />
                  </Button>

                  {priceResult && !priceError && brandSettings.paypalMeLink && (
                    <Button
                      onClick={handlePayWithPayPal}
                      w="full"
                      borderRadius="2xl"
                      bg="#0070ba"
                      px={6}
                      py={4}
                      fontSize="base"
                      fontWeight="bold"
                      color="white"
                      _hover={{ bg: '#003087' }}
                      _active={{ scale: 0.97 }}
                      shadow="lg"
                    >
                      💳 <FormattedMessage id="payment.paypal" defaultMessage="Pay with PayPal" />
                    </Button>
                  )}

                  <Button
                    onClick={handleChatOnWhatsApp}
                    w="full"
                    borderRadius="2xl"
                    borderWidth={2}
                    borderColor="teal.200"
                    bg="white"
                    px={6}
                    py={4}
                    fontSize="base"
                    fontWeight="semibold"
                    color="teal.700"
                    _hover={{ bg: 'teal.50' }}
                    _active={{ scale: 0.97 }}
                  >
                    💬 <FormattedMessage id="transport.chatOnWhatsApp" defaultMessage="Chat / Question" />
                  </Button>
                </VStack>
              </VStack>
            </Box>
          </Flex>
        )}
      </Box>
    </Box>
  );
};

export default Transport;
