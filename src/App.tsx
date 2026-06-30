import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Box, Flex } from '@chakra-ui/react';
import Home from './pages/Home';
import Tours from './pages/Tours';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import Transport from './pages/Transport';
import Blog from './pages/Blog';
import ServiceDetails from './pages/ServiceDetails';
import AdminTransport from './pages/AdminTransport';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToHash from './components/ScrollToHash';

const App = () => {
  return (
    <Router>
      <Flex direction="column" minH="100vh">
        <ScrollToHash />
        <Header />
        <Box as="main" id="top" flex="1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tours" element={<Tours />} />
            <Route path="/transport" element={<Transport />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/details/:category/:id" element={<ServiceDetails />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<ProtectedRoute component={Admin} />} />
            <Route path="/admin/transport" element={<ProtectedRoute component={AdminTransport} />} />
          </Routes>
        </Box>
        <Footer />
      </Flex>
    </Router>
  );
};

export default App;