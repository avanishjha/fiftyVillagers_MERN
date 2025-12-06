import React, { useState } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { Sun, Moon, Menu, X, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import logo from '../assets/logo.jpg';

const Navbar = () => {
    const [hidden, setHidden] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isStudentDropdownOpen, setIsStudentDropdownOpen] = useState(false); // Mobile dropdown state
    const { scrollY } = useScroll();
    const { theme, toggleTheme } = useTheme();

    // ... (keep useMotionValueEvent)
    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = scrollY.getPrevious();
        if (latest > previous && latest > 150) {
            setHidden(true);
        } else {
            setHidden(false);
        }
    });

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'About', path: '/#about' },
        { name: 'Programs', path: '/#programs' },
        { name: 'Gallery', path: '/gallery' },
        { name: 'Blogs', path: '/blogs' },
        { name: 'Contact', path: '/#contact' },
    ];

    return (
        <motion.nav
            initial={{ y: -100, opacity: 0, filter: "blur(10px)" }}
            variants={{
                visible: { y: 0, opacity: 1, filter: "blur(0px)" },
                hidden: { y: "-100%", opacity: 0, filter: "blur(5px)" },
            }}
            animate={hidden ? "hidden" : "visible"}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="fixed top-0 w-full z-50 bg-white dark:bg-gray-900 shadow-md transition-colors duration-500"
        >
            <div className="container mx-auto px-6 py-6 flex justify-between items-center">
                <a href="/" className="flex items-center gap-3 text-2xl font-bold text-gray-900 dark:text-white tracking-tighter font-sans">
                    <img src={logo} alt="Fifty Villagers Logo" className="h-10 w-10 rounded-lg object-contain" />
                    <span>Fifty<span className="text-emerald-600 dark:text-emerald-400">Villagers</span></span>
                </a>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center space-x-2 lg:space-x-6">
                    {navLinks.map((item) => (
                        <a
                            key={item.name}
                            href={item.path}
                            className="group relative overflow-hidden px-3 py-2 rounded-full text-gray-800 dark:text-gray-200 transition-colors text-sm font-medium uppercase tracking-wide font-body"
                        >
                            <span className="relative z-10 group-hover:text-white transition-colors duration-300">{item.name}</span>
                            <span className="absolute inset-0 bg-emerald-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
                        </a>
                    ))}

                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-900 dark:text-white"
                    >
                        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                    </button>

                    {/* Student Dropdown */}
                    <div className="relative group">
                        <button className="flex items-center gap-1 bg-emerald-600 text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-emerald-700 transition-colors font-sans shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all">
                            Student <ChevronDown size={16} />
                        </button>
                        <div className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right">
                            <Link to="/instructions" className="block px-6 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors border-b border-gray-100 dark:border-gray-700">
                                Apply Now
                            </Link>
                            <Link to="/success-stories" className="block px-6 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                                Success Stories
                            </Link>
                        </div>
                    </div>

                    <button className="bg-black dark:bg-white text-white dark:text-black px-6 py-2.5 rounded-full font-bold text-sm hover:opacity-80 transition-opacity font-sans shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all">
                        Donate
                    </button>
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden flex items-center gap-4">
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-900 dark:text-white"
                    >
                        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                    </button>
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="text-gray-900 dark:text-white"
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 overflow-y-auto max-h-[90vh]"
                >
                    <div className="flex flex-col p-6 space-y-4">
                        {navLinks.map((item) => (
                            <a
                                key={item.name}
                                href={item.path}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-gray-900 dark:text-white text-lg font-medium font-body"
                            >
                                {item.name}
                            </a>
                        ))}

                        {/* Mobile Student Section */}
                        <div className="pt-2 pb-2">
                            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-bold uppercase tracking-wider mb-2">Student Section</h3>
                            <Link
                                to="/instructions"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="block py-2 text-gray-900 dark:text-white text-lg font-medium hover:text-emerald-600 dark:hover:text-emerald-400"
                            >
                                Apply Now
                            </Link>
                            <Link
                                to="/success-stories"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="block py-2 text-gray-900 dark:text-white text-lg font-medium hover:text-emerald-600 dark:hover:text-emerald-400"
                            >
                                Success Stories
                            </Link>
                        </div>

                        <button className="bg-black dark:bg-white text-white dark:text-black w-full py-4 rounded-lg font-bold font-sans shadow-lg mt-4">
                            Donate Now
                        </button>
                    </div>
                </motion.div>
            )}
        </motion.nav>
    );
};

export default Navbar;
