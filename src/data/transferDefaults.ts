import { TransferConfig } from '../types/transport';
import { DEFAULT_MUNICIPIO_MULTIPLIERS } from './municipioPriceMultipliers';

const VEHICLE_TYPES: TransferConfig['vehicleTypes'] = [
  { key: 'sedan', label: 'Economy Sedan', multiplier: 1.0, pricePerKmMultiplier: 1.0, passengerThreshold: 4, passengerMultiplier: 2, maxPassengers: 3, typicalPassengers: [1, 2], description: 'Perfect for 1–2 travelers with light luggage', image: '' },
  { key: 'suv', label: 'SUV / Family', multiplier: 1.25, pricePerKmMultiplier: 1.05, passengerThreshold: 6, passengerMultiplier: 2, maxPassengers: 5, typicalPassengers: [3, 5], description: 'Spacious for families or groups up to 5', image: '' },
  { key: 'minivan', label: 'Minivan', multiplier: 1.5, pricePerKmMultiplier: 1.1, passengerThreshold: 9, passengerMultiplier: 2, maxPassengers: 8, typicalPassengers: [5, 7], description: 'Comfortable for medium groups up to 7', image: '' },
  { key: 'sprinter', label: 'Sprinter / Group Van', multiplier: 1.9, pricePerKmMultiplier: 1.2, passengerThreshold: 15, passengerMultiplier: 2, maxPassengers: 14, typicalPassengers: [8, 14], description: 'Ideal for larger groups up to 14', image: '' },
  { key: 'minibus', label: 'Mini Bus', multiplier: 2.8, pricePerKmMultiplier: 1.3, passengerThreshold: 25, passengerMultiplier: 2, maxPassengers: 24, typicalPassengers: [15, 24], description: 'Best for large groups up to 24', image: '' },
  { key: 'coach_bus', label: 'Coach Bus', multiplier: 4.5, pricePerKmMultiplier: 1.5, passengerThreshold: 56, passengerMultiplier: 2, maxPassengers: 55, typicalPassengers: [25, 55], description: 'Full-size coach for 25+ passengers', image: '' },
  { key: 'vip_sports', label: 'VIP / Sports Luxury', multiplier: 2.4, pricePerKmMultiplier: 1.6, passengerThreshold: 4, passengerMultiplier: 2, maxPassengers: 3, typicalPassengers: [1, 2], description: 'Premium luxury experience for special occasions', image: '' },
  { key: 'luxury_suv', label: 'Luxury SUV', multiplier: 1.8, pricePerKmMultiplier: 1.25, passengerThreshold: 6, passengerMultiplier: 2, maxPassengers: 5, typicalPassengers: [2, 5], description: 'Premium SUV with extra comfort and space', image: '' },
];

export const DEFAULT_TRANSFER_CONFIG: TransferConfig = {
  airport: 'PUJ',
  currency: 'USD',
  vehicleTypes: VEHICLE_TYPES,
  zones: [],
  modifiers: {
    pricePerKm: 1.3,
    minimumPrice: 25,
    roundTripDiscount: 0.9,
    nightFeeMultiplier: 1.15,
    waitingPerHour: 20,
    childSeat: 10,
    premiumZoneBoost: 1.1,
    fuelVolatility: 1.0,
    priceMarkup: 1.3,
    distanceDiscountMaxPercent: 26.9,
    distanceDiscountSaturationKm: 30,
    municipioMultipliers: DEFAULT_MUNICIPIO_MULTIPLIERS,
  },
};
