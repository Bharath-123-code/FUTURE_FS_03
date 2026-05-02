import React from 'react';
import { useNavigate } from 'react-router-dom';

const Footer = ({ setShowMenu }) => {
  const navigate = useNavigate();

  return (
    <>
      <footer className="bg-gradient-to-br from-navy-blue via-dark to-dark text-white py-8 px-6 mt-12 border-t-4 border-primary shadow-2xl">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Restaurant Info */}
            <div>
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">🍽️ SpiceHub</h3>
              <p className="text-gray-300 mb-2">
                Modern digital restaurant management system with real-time order tracking and smart waiter notifications.
              </p>
              <p className="text-gray-400 text-sm">
                © 2026 SpiceHub. All rights reserved.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><button onClick={() => navigate('/')} className="text-gray-300 hover:text-primary transition-colors">Home</button></li>
                <li><button onClick={() => { setShowMenu(true); navigate('/'); }} className="text-gray-300 hover:text-primary transition-colors">Menu</button></li>
                <li><button onClick={() => navigate('/about')} className="text-gray-300 hover:text-primary transition-colors">About</button></li>
                <li><button onClick={() => navigate('/contact')} className="text-gray-300 hover:text-primary transition-colors">Contact</button></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
