import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { useBrand } from '../contexts/BrandContext';
import { generateWhatsAppMessage } from '../utils/whatsapp';

interface FABWhatsAppProps {
  phoneNumber?: string;
  message?: string;
}

const FABWhatsApp: React.FC<FABWhatsAppProps> = ({
  phoneNumber,
  message = 'Hola! Me gustaría información sobre sus tours.'
}) => {
  const { brandSettings } = useBrand();
  const effectivePhone = phoneNumber || brandSettings.phoneNumber || '+18095553333';

  const handleClick = () => {
    window.open(generateWhatsAppMessage(effectivePhone, message), '_blank');
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-16 h-16 rounded-full bg-green-500 text-white shadow-lg hover:bg-green-600 hover:shadow-xl transition-all duration-300 hover:scale-110 animate-pulse"
      aria-label="Contact via WhatsApp"
      title="Chat with us on WhatsApp"
    >
      <FaWhatsapp className="w-8 h-8" />
    </button>
  );
};

export default FABWhatsApp;
