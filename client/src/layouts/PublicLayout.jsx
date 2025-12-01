import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from '../context/ThemeContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Preloader from '../components/Preloader';
import { Outlet } from 'react-router-dom';

const PublicLayout = () => {
    const hasLoaded = sessionStorage.getItem('hasLoaded') === 'true';
    const [isLoading, setIsLoading] = useState(!hasLoaded);

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
                <div className="zoom-[0.8] pt-24">
                    <main>
                        <Outlet />
                    </main>
                    <Footer />
                </div>
            </div>
        </ThemeProvider>
    );
};

export default PublicLayout;
