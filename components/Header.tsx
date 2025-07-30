import React, { useState } from 'react';
import { FiSearch, FiShoppingCart, FiUser, FiMenu, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="fixed w-full bg-white/90 backdrop-blur-md shadow-sm z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo & Brand Name */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-shrink-0 flex items-center"
          >
            <div className="flex items-center space-x-2">
              <motion.div
                whileHover={{ rotate: 15 }}
                className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold shadow-md"
              >
                <span className="text-lg">EH</span>
              </motion.div>
              <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                EventHorizon
              </span>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <motion.a
              whileHover={{ y: -2 }}
              href="#"
              className="font-medium text-gray-700 hover:text-purple-600 transition flex items-center group"
            >
              Concerts
              <span className="ml-1 text-purple-500 opacity-0 group-hover:opacity-100 transition">→</span>
            </motion.a>
            <motion.a
              whileHover={{ y: -2 }}
              href="#"
              className="font-medium text-gray-700 hover:text-purple-600 transition flex items-center group"
            >
              Sports
              <span className="ml-1 text-purple-500 opacity-0 group-hover:opacity-100 transition">→</span>
            </motion.a>
            <motion.a
              whileHover={{ y: -2 }}
              href="#"
              className="font-medium text-gray-700 hover:text-purple-600 transition flex items-center group"
            >
              Festivals
              <span className="ml-1 text-purple-500 opacity-0 group-hover:opacity-100 transition">→</span>
            </motion.a>
            <motion.a
              whileHover={{ y: -2 }}
              href="#"
              className="font-medium text-gray-700 hover:text-purple-600 transition flex items-center group"
            >
              Theater
              <span className="ml-1 text-purple-500 opacity-0 group-hover:opacity-100 transition">→</span>
            </motion.a>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-full hover:bg-gray-100 transition"
            >
              <FiSearch className="h-5 w-5 text-gray-600" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-full hover:bg-gray-100 transition relative"
            >
              <FiShoppingCart className="h-5 w-5 text-gray-600" />
              <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center shadow-sm">
                3
              </span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-2 rounded-lg transition shadow-md"
            >
              <FiUser className="inline mr-2" />
              Sign In
            </motion.button>
          </div>

          {/* Mobile Actions - Always visible cart */}
          <div className="md:hidden flex items-center space-x-4">
            <button className="p-2 rounded-full hover:bg-gray-100 transition relative">
              <FiShoppingCart className="h-5 w-5 text-gray-600" />
              <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                3
              </span>
            </button>
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-gray-700 hover:text-purple-600 focus:outline-none"
            >
              {isMenuOpen ? (
                <FiX className="h-6 w-6" />
              ) : (
                <FiMenu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu (Animated) */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white shadow-lg overflow-hidden"
          >
            <div className="px-4 pt-2 pb-4 space-y-2">
              <motion.a
                whileHover={{ x: 5 }}
                href="#"
                className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 border-b border-gray-100"
              >
                Concerts
              </motion.a>
              <motion.a
                whileHover={{ x: 5 }}
                href="#"
                className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 border-b border-gray-100"
              >
                Sports
              </motion.a>
              <motion.a
                whileHover={{ x: 5 }}
                href="#"
                className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 border-b border-gray-100"
              >
                Festivals
              </motion.a>
              <motion.a
                whileHover={{ x: 5 }}
                href="#"
                className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 border-b border-gray-100"
              >
                Theater
              </motion.a>
              <div className="pt-4">
                <div className="flex items-center space-x-4 px-3">
                  <button className="p-2 rounded-full hover:bg-gray-100 transition">
                    <FiSearch className="h-5 w-5 text-gray-600" />
                  </button>
                  <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-2 rounded-lg transition shadow-md">
                    <FiUser className="inline mr-2" />
                    Sign In
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;