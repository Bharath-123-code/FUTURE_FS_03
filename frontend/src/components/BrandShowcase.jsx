import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const BrandShowcase = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const brandSlides = [
    "/Images/Burger.jpg",
    "/Images/pizza.jpg",
    "/Images/salads.jpg"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % brandSlides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);
  return (
    <section className="py-20 px-6 bg-transparent backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif text-white mb-4 decorative-underline">
            Our Story
          </h2>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Discover the essence of SpiceHub - where culinary art meets passion
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left side - Brand image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-primary/20">
              <img
                src={brandSlides[currentSlide]}
                alt="SpiceHub Restaurant"
                className="w-full h-96 object-cover transition-opacity duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="text-3xl font-bold mb-2 drop-shadow-lg">🍽️ SpiceHub</h3>
                <p className="text-lg opacity-95 drop-shadow-md">Since 2026 • Culinary Excellence</p>
              </div>
              {/* Slide indicators */}
              <div className="absolute bottom-4 right-4 flex space-x-2">
                {brandSlides.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentSlide ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </div>
            
            {/* Floating decorative elements */}
            <motion.div
              className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-primary to-orange-400 rounded-full shadow-lg"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear"
              }}
            ></motion.div>
            <motion.div
              className="absolute -bottom-8 -right-8 w-32 h-32 bg-gradient-to-br from-sage-green/20 to-green-300/20 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
              }}
            ></motion.div>
          </motion.div>

          {/* Right side - Brand story */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="chalkboard-card p-6 rounded-2xl">
              <h3 className="text-2xl font-serif-bold text-white mb-4">
                🍲 Culinary Excellence
              </h3>
              <p className="text-white/80 leading-relaxed">
                At SpiceHub, we believe that great food is more than just sustenance – it's an experience. 
              </p>
            </div>

            <div className="chalkboard-card p-6 rounded-2xl">
              <h3 className="text-2xl font-serif-bold text-white mb-4">
                ✨ Our Promise
              </h3>
              <p className="text-white/80 leading-relaxed">
                Every meal at SpiceHub is a celebration of flavor, texture, and aroma. We source locally, 
                globally, and serve with love. Your satisfaction is our greatest achievement.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <motion.div whileHover={{ scale: 1.05 }} className="chalkboard-card flex items-center space-x-2 p-4 rounded-xl cursor-pointer">
                <span className="text-3xl">🍽️</span>
                <span className="text-sm font-semibold text-white">Fine Dining</span>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} className="chalkboard-card flex items-center space-x-2 p-4 rounded-xl cursor-pointer">
                <span className="text-3xl">👨‍🍳</span>
                <span className="text-sm font-semibold text-white">Expert Chefs</span>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} className="chalkboard-card flex items-center space-x-2 p-4 rounded-xl cursor-pointer">
                <span className="text-3xl">🌟</span>
                <span className="text-sm font-semibold text-white">Quality Service</span>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} className="chalkboard-card flex items-center space-x-2 p-4 rounded-xl cursor-pointer">
                <span className="text-3xl">🥘</span>
                <span className="text-sm font-semibold text-white">Authentic Recipes</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BrandShowcase;
