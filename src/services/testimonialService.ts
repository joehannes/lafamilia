import { apiGet, apiPut } from './apiClient';

export interface TestimonialRecord {
  id: string;
  name: string;
  email: string;
  review: string;
  rating: number;
  profileImage?: string;
  createdAt: string;
}

const defaultTestimonials: TestimonialRecord[] = [
  {
    id: '1',
    name: 'Sarah Martinez',
    email: 'sarah@example.com',
    review:
      'The quad adventure was absolutely incredible! Our guide knew everything about the jungle, and the cenote was so refreshing. Best day of our vacation!',
    rating: 5,
    createdAt: '2024-03-15'
  },
  {
    id: '2',
    name: 'Michael Johnson',
    email: 'michael@example.com',
    review:
      'The Saona Island party boat exceeded all expectations. The energy was infectious, the food was delicious, and the snorkeling was amazing. Definitely doing it again next year!',
    rating: 5,
    createdAt: '2024-03-10'
  },
  {
    id: '3',
    name: 'Emma García',
    email: 'emma@example.com',
    review:
      'Las cascadas de Samaná fueron hermosas. La caminata fue perfecta, el guía muy atento, y las fotos quedaron espectaculares. Una experiencia que nunca voy a olvidar.',
    rating: 5,
    createdAt: '2024-03-05'
  }
];

const unwrapTestimonialPayload = (payload: unknown): TestimonialRecord[] => {
  const record = (payload as Record<string, unknown>)?.record ?? payload;
  if (Array.isArray((record as Record<string, unknown>).testimonials)) {
    return (record as Record<string, unknown>).testimonials as TestimonialRecord[];
  }
  if (Array.isArray(record)) {
    return record as TestimonialRecord[];
  }
  return defaultTestimonials;
};

export const getTestimonials = async (): Promise<TestimonialRecord[]> => {
  try {
    const data = await apiGet<unknown>('testimonials');
    return unwrapTestimonialPayload(data);
  } catch (error) {
    console.warn('Error loading testimonials:', error);
    return defaultTestimonials;
  }
};

export const saveTestimonials = async (testimonials: TestimonialRecord[]): Promise<TestimonialRecord[]> => {
  try {
    await apiPut<unknown>('testimonials', { testimonials });
    return testimonials;
  } catch (error) {
    console.error('Error saving testimonials:', error);
    return testimonials;
  }
};
