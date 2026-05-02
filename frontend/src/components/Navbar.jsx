import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useSearch } from '../context/SearchContext';
import { useToast } from '../context/ToastContext';

const Navbar = ({ showMenu, setShowMenu }) => {
  const navigate = useNavigate();
  const { getTotalItems, openCheckout } = useCart();
  const { searchQuery, updateSearchQuery, performSearch, clearSearch } = useSearch();
  const { showSuccess } = useToast();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    console.log('Navbar: handleMenuToggle called, setting showMenu to true');
    setShowMenu(true);
    navigate('/');
    console.log('Navbar: navigated to menu');
    // Close mobile menu when toggling main menu
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const query = formData.get('searchQuery');
    console.log('Navbar: handleSearchSubmit called with query:', query);
    
    if (query) {
      // Update search context and navigate to search results
      updateSearchQuery(query);
      performSearch(query);
      navigate('/search');
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    console.log('Navbar: handleSearchChange called with:', query);
    updateSearchQuery(query);
    
    // If search is cleared, navigate back to home
    if (!query && window.location.pathname === '/search') {
      navigate('/');
      clearSearch();
    }
  };

  const handleWhatsAppOrder = () => {
    // Show "will be available soon" message
    showSuccess('WhatsApp ordering will be available soon!');
  };

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  };

  return (
    <nav className="bg-black/40 backdrop-blur-lg text-white py-4 px-6 relative sticky top-0 z-50 border-b border-white/20 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo on left with branding image */}
        <button 
          onClick={() => navigate('/')}
          className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
        >
          <img 
            src="/Images/main course.jpg" 
            alt="SpiceHub" 
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border-3 border-primary shadow-lg"
          />
          <h1 className="text-xl sm:text-2xl font-serif text-white">SpiceHub</h1>
        </button>

        {/* Desktop Navigation menu in center */}
        <div className="hidden md:flex items-center space-x-6 xl:space-x-8">
          <button 
            onClick={() => { setShowMenu(false); navigate('/'); }}
            className="text-sm xl:text-base hover:text-cream transition-colors"
          >
            Home
          </button>
          <button 
          onClick={handleMenuToggle}
          className={`text-sm xl:text-base hover:text-cream transition-colors ${
            showMenu ? 'text-cream font-semibold' : ''
          }`}
        >
          Menu
        </button>
          <button 
            onClick={() => showSuccess('Offers will be available soon!')}
            className="text-sm xl:text-base hover:text-cream transition-colors"
          >
            Offers
          </button>
          <button 
            onClick={() => navigate('/about')}
            className="text-sm xl:text-base hover:text-cream transition-colors"
          >
            About Us
          </button>
          <button 
            onClick={() => navigate('/contact')}
            className="text-sm xl:text-base hover:text-cream transition-colors"
          >
            Contact
          </button>
          
          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              name="searchQuery"
              type="text"
              placeholder="Search dishes..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="px-4 py-2 rounded-full bg-white/10 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cream focus:bg-white/20 transition-all w-48"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-cream transition-colors"
            >
              🔍
            </button>
          </form>
        </div>

        {/* Right side buttons */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Cart button - responsive sizing */}
          <button
            onClick={openCheckout}
            className="relative bg-primary text-white px-2 py-2 sm:px-3 sm:py-2 lg:px-4 lg:py-2 rounded-full hover:bg-opacity-90 transition-all flex items-center"
          >
            <span className="text-lg sm:text-xl lg:text-xl mr-1 sm:mr-2 lg:mr-2">🛒</span>
            <span className="hidden sm:inline lg:inline">Cart</span>
            {getTotalItems() > 0 && (
              <span className="absolute -top-1 -right-1 sm:-top-1 sm:-right-1 lg:-top-2 lg:-right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 flex items-center justify-center">
                {getTotalItems()}
              </span>
            )}
          </button>

          {/* WhatsApp button - responsive with pulse animation */}
          <button 
            onClick={handleWhatsAppOrder}
            className="bg-green-500 text-white px-2 py-2 sm:px-3 sm:py-2 lg:px-6 lg:py-2 rounded-full hover:bg-opacity-90 transition-all flex items-center pulse-subtle"
          >
            <span className="text-lg sm:text-xl lg:text-lg mr-1 sm:mr-2 lg:mr-2">📱</span>
            <span className="hidden sm:inline lg:inline">Order on WhatsApp</span>
          </button>

          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="lg:hidden text-white hover:text-primary transition-colors p-1"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden absolute top-full left-0 right-0 bg-dark border-t border-gray-700 z-50 overflow-hidden"
          >
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.1, ease: "easeOut" }}
              className="flex flex-col p-4 space-y-4"
            >
              {/* Mobile Search Bar */}
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  name="searchQuery"
                  type="text"
                  placeholder="Search dishes..."
                  onChange={handleSearchChange}
                  className="w-full px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white/20 transition-all"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-primary transition-colors"
                >
                  🔍
                </button>
              </form>
              
              <motion.button
                whileHover={{ x: 5 }}
                onClick={() => { setShowMenu(false); navigate('/'); setIsMenuOpen(false); }}
                className="hover:text-primary transition-colors py-2 text-left w-full"
              >
                Home
              </motion.button>
              <motion.button
                whileHover={{ x: 5 }}
                className="hover:text-primary transition-colors py-2 text-left w-full"
                onClick={() => {
                  handleMenuToggle();
                  setIsMenuOpen(false);
                }}
              >
                Menu
              </motion.button>
              <motion.button
                whileHover={{ x: 5 }}
                className="hover:text-primary transition-colors py-2 text-left w-full"
                onClick={() => { showSuccess('Offers will be available soon!'); setIsMenuOpen(false); }}
              >
                Offers
              </motion.button>
              <motion.button
                whileHover={{ x: 5 }}
                onClick={() => { navigate('/about'); setIsMenuOpen(false); }}
                className="hover:text-primary transition-colors py-2 text-left w-full"
              >
                About Us
              </motion.button>
              <motion.button
                whileHover={{ x: 5 }}
                onClick={() => { navigate('/contact'); setIsMenuOpen(false); }}
                className="hover:text-primary transition-colors py-2 text-left w-full"
              >
                Contact
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
