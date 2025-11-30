import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import ImageGallery from './components/ImageGallery';
import Programs from './components/Programs';
import Stats from './components/Stats';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Preloader from './components/Preloader';
import Marquee from './components/Marquee';

function App() {
  // Check if preloader has already been shown in this session
  const hasLoaded = sessionStorage.getItem('hasLoaded') === 'true';
  const [isLoading, setIsLoading] = useState(true); //!hasLoaded

  return (
    <ThemeProvider>
      <AnimatePresence mode="wait">
        {isLoading && <Preloader onComplete={() => setIsLoading(false)} zoom={1} />}
      </AnimatePresence>

      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-sans selection:bg-blue-500 selection:text-white transition-colors duration-500">
        {!isLoading && (
          <div className="zoom-[0.8]">
            <div className="pointer-events-auto">
              <Navbar />
            </div>
          </div>
        )}
        <div className="zoom-[0.8]">
          <main>
            <Hero />
            <Marquee />
            <About />
            <ImageGallery />
            <Stats />
            <Programs />
            <Contact />
          </main>
          <Footer />
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
