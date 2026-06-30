import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { FaStar } from 'react-icons/fa';

interface TestimonialFormProps {
  onSubmit: (name: string, email: string, review: string, profileImage?: string) => void;
  isLoading?: boolean;
}

const TestimonialForm: React.FC<TestimonialFormProps> = ({ onSubmit, isLoading = false }) => {
  const [review, setReview] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rating, setRating] = useState(5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (review.trim() && name.trim() && email.trim()) {
      onSubmit(name, email, review, undefined);
      setReview('');
      setName('');
      setEmail('');
      setRating(5);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-gradient-to-br from-orange-50 to-pink-50 rounded-2xl border-2 border-orange-200 shadow-lg">
      <h3 className="text-2xl font-bold text-slate-900 mb-4 text-center">
        <FormattedMessage id="testimonials.addTestimonial" />
      </h3>

      <div className="mb-6 p-4 bg-slate-100 border border-slate-200 rounded-lg text-slate-700">
        <FormattedMessage id="testimonials.enterDetailsManually" defaultMessage="Enter your details below to submit a testimonial." />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Rating</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="focus:outline-none transition-transform hover:scale-125"
              >
                <FaStar
                  className={`text-2xl ${
                    star <= rating ? 'text-yellow-400' : 'text-slate-300'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            <FormattedMessage id="testimonials.yourName" />
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="w-full px-4 py-2 border-2 border-orange-200 rounded-lg focus:outline-none focus:border-orange-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full px-4 py-2 border-2 border-orange-200 rounded-lg focus:outline-none focus:border-orange-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            <FormattedMessage id="testimonials.yourReview" />
          </label>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Share your adventure story..."
            rows={4}
            maxLength={500}
            className="w-full px-4 py-2 border-2 border-orange-200 rounded-lg focus:outline-none focus:border-orange-500 resize-none"
          />
          <p className="text-xs text-slate-500 mt-1">{review.length}/500 characters</p>
        </div>

        <button
          type="submit"
          disabled={isLoading || !review.trim() || !name.trim() || !email.trim()}
          className="w-full py-3 px-4 bg-gradient-to-r from-pink-500 to-orange-500 text-white font-bold rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Sharing...' : <FormattedMessage id="testimonials.submitReview" />}
        </button>
      </form>
    </div>
  );
};

export default TestimonialForm;
