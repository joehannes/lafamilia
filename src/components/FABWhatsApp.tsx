import React from 'react';
import { motion } from 'framer-motion';
import { FaWhatsapp } from 'react-icons/fa';
import { IconButton } from '@chakra-ui/react';
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
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.5, type: "spring", stiffness: 400 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      style={{
        position: 'fixed',
        bottom: '1.5rem',
        right: '1.5rem',
        zIndex: 50,
      }}
    >
      <IconButton
        aria-label="Contact via WhatsApp"
        title="Chat with us on WhatsApp"
        onClick={handleClick}
        icon={<FaWhatsapp size="32px" />}
        w={16}
        h={16}
        borderRadius="full"
        bg="green.500"
        color="white"
        boxShadow="lg"
        _hover={{
          bg: 'green.600',
          boxShadow: 'xl',
        }}
        transition="all 0.3s"
      />
    </motion.div>
  );
};

export default FABWhatsApp;
