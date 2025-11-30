import React from 'react';
import { Facebook, Instagram, Twitter, Youtube, ArrowRight, Heart } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white pt-20 pb-10 border-t border-gray-800 relative overflow-hidden">
            {/* Watermark */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-5">
                <span className="text-[20vw] font-bold text-white whitespace-nowrap absolute -bottom-10 -left-10 leading-none select-none">FIFTY</span>
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Column */}
                    <div>
                        <div className="text-3xl font-bold tracking-tighter mb-6">
                            Fifty<span className="text-emerald-500">Villagers</span>
                        </div>
                        <p className="text-gray-400 mb-8 leading-relaxed">
                            Empowering rural students with free education and holistic development. Join us in building a brighter future.
                        </p>
                        <div className="flex space-x-4">
                            {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                                <a key={i} href="#" className="bg-gray-800 p-3 rounded-full hover:bg-emerald-600 transition-all hover:-translate-y-1">
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-bold mb-6 uppercase tracking-wider">Quick Links</h4>
                        <ul className="space-y-4 text-gray-400">
                            {['Home', 'About Us', 'Our Programs', 'Success Stories', 'Contact'].map((item) => (
                                <li key={item}>
                                    <a href={`#${item.toLowerCase().replace(' ', '-')}`} className="hover:text-emerald-400 transition-colors flex items-center gap-2 group">
                                        <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="text-lg font-bold mb-6 uppercase tracking-wider">Legal</h4>
                        <ul className="space-y-4 text-gray-400">
                            {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Disclaimer'].map((item) => (
                                <li key={item}>
                                    <a href="#" className="hover:text-emerald-400 transition-colors">
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="text-lg font-bold mb-6 uppercase tracking-wider">Stay Updated</h4>
                        <p className="text-gray-400 mb-4 text-sm">Subscribe to our newsletter for the latest updates and stories.</p>
                        <form className="space-y-4">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                            />
                            <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg transition-colors">
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
                    <p>&copy; {new Date().getFullYear()} Fifty Villagers Seva Sansthan. All rights reserved.</p>
                    <p className="flex items-center gap-1 mt-4 md:mt-0">
                        Made with <Heart size={14} className="text-red-500 fill-red-500" /> for a better world.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
