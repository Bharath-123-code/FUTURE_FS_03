import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { SearchProvider } from './context/SearchContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CategoryGrid from './components/CategoryGrid';
import BrandShowcase from './components/BrandShowcase';
import Menu from './components/Menu';
import SearchResults from './components/SearchResults';
import CheckoutModal from './components/CheckoutModal';
import StickyCart from './components/StickyCart';
import WaiterDashboard from './components/WaiterDashboard';
import OrderTracking from './components/OrderTracking';
import Contact from './components/Contact';
import About from './components/About';
import Footer from './components/Footer';
import MissedCalls from './components/MissedCalls';

function App() {
  const [showMenu, setShowMenu] = useState(false);
  
  console.log('App: Component rendering, showMenu:', showMenu);
  
  // Add effect to track showMenu changes
  React.useEffect(() => {
    console.log('App: showMenu effect triggered, new value:', showMenu);
  }, [showMenu]);

  return (
    <Router>
      <ToastProvider>
        <SearchProvider>
          <CartProvider>
              {/* Mesh Gradient Background */}
              <div className="mesh-gradient-wrapper">
                <div className="mesh-gradient-bg"></div>
                <div className="mesh-circle-3"></div>
              </div>
              
              {/* Main Content */}
              <div className="chalkboard-container min-h-screen bg-[#121212] text-white pb-16 md:pb-0 relative">
                {/* Background Image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-70"
                  style={{backgroundImage: 'url(/Images/background.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed'}}
                ></div>
                {/* Floating Ingredient Elements */}
                <img src="/chili.svg" alt="Chili" className="floating-chili" />
                <img src="/tomato.svg" alt="Tomato" className="floating-tomato" />
                <img src="/herbs.svg" alt="Herbs" className="floating-herbs" />
                <img src="/pepper.svg" alt="Pepper" className="floating-pepper" />
                
                {/* Content Container */}
                <div className="relative z-10">
                  <Navbar showMenu={showMenu} setShowMenu={setShowMenu} />
                  <CheckoutModal setShowMenu={setShowMenu} />
                  <StickyCart />
                  <MissedCalls />
                  <Routes>
                    <Route path="/" element={
                      <>
                        {showMenu ? (
                          <Menu setShowMenu={setShowMenu} />
                        ) : (
                          <>
                            <Hero setShowMenu={setShowMenu} />
                            <CategoryGrid />
                            <BrandShowcase />
                          </>
                        )}
                        <Footer setShowMenu={setShowMenu} />
                      </>
                    } />
                    <Route path="/search" element={<SearchResults />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/waiter/:id" element={<WaiterDashboard />} />
                    <Route path="/order-tracking/:id" element={<OrderTracking />} />
                  </Routes>
                </div>
              </div>
            </CartProvider>
          </SearchProvider>
        </ToastProvider>
    </Router>
  );
};

export default App;
