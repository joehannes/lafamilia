import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { I18nProvider } from './contexts/I18nContext';
import { BrandProvider } from './contexts/BrandContext';
import { BlogProvider } from './contexts/BlogContext';
import { MapProvider } from './contexts/MapContext';
import { ChakraProvider } from '@chakra-ui/react';
import { theme } from './styles/theme';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <I18nProvider>
        <BrandProvider>
          <MapProvider>
            <BlogProvider>
              <App />
            </BlogProvider>
          </MapProvider>
        </BrandProvider>
      </I18nProvider>
    </ChakraProvider>
  </React.StrictMode>
);