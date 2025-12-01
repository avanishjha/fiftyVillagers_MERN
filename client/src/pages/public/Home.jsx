import React from 'react';
import Hero from '../../components/Hero';
import About from '../../components/About';
import ImageGallery from '../../components/ImageGallery';
import Programs from '../../components/Programs';
import Stats from '../../components/Stats';
import Contact from '../../components/Contact';
import Marquee from '../../components/Marquee';

const Home = () => {
    return (
        <>
            <Hero />
            <Marquee />
            <About />
            <ImageGallery />
            <Stats />
            <Programs />
            <Contact />
        </>
    );
};

export default Home;
