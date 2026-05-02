import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Hero = ({ setShowMenu }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    "/Images/Burger.jpg",
    "/Images/pizza.jpg", 
    "/Images/salads.jpg"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [slides.length]);
  return (
    <section className="relative bg-transparent py-20 px-6 min-h-[700px] md:min-h-[600px] overflow-hidden">
      {/* Background image for mobile with overlay */}
      <div className="md:hidden absolute inset-0 bg-gradient-to-r from-cream/90 to-cream/70">
        <div className="absolute inset-0 bg-cover bg-center opacity-40" 
             style={{backgroundImage: 'url(/Images/hero1.jpg)'}}>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between relative z-10 px-4 sm:px-6 lg:px-8">
        {/* Left side - Text content */}
        <div className="lg:w-1/2 mb-8 lg:mb-0 text-center lg:text-left">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white mb-6 decorative-underline">
            Good Food <span className="text-cream">Good Mood</span>
          </h1>
          <p className="text-2xl md:text-3xl lg:text-4xl font-sans text-white/90 mb-8 max-w-md mx-auto lg:mx-0 leading-tight">
            Delicious Food, Made with Love
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <button 
              onClick={() => setShowMenu(true)}
              className="bg-gradient-to-r from-sage-green to-green-500 text-white px-8 py-3 rounded-xl hover:shadow-lg hover:shadow-sage-green/50 transition-all text-lg font-semibold shadow-md"
            >
              View Menu
            </button>
          </div>
        </div>

        {/* Right side - Slideshow for tablet view */}
        <div className="hidden md:flex lg:hidden w-full justify-center mt-8">
          <motion.div 
            className="relative"
            animate={{
              y: [0, -10, 0],
              scale: [1, 1.02, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <motion.div 
              className="w-72 h-72 md:w-80 md:h-80 rounded-2xl overflow-hidden shadow-2xl"
              whileHover={{
                scale: 1.05,
                boxShadow: "0 25px 50px rgba(0,0,0,0.25)"
              }}
              transition={{
                duration: 0.3,
                ease: "easeOut"
              }}
            >
              <img 
                src={slides[currentSlide]}
                alt="Delicious Food"
                className="w-full h-full object-cover transition-opacity duration-500"
              />
            </motion.div>
            {/* Decorative elements */}
            <motion.div 
              className="absolute -top-4 -right-4 w-16 h-16 bg-primary rounded-full opacity-20"
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
              className="absolute -bottom-4 -left-4 w-20 h-20 bg-primary rounded-full opacity-10"
              animate={{
                scale: [1, 1.1, 1],
                rotate: [360, 180, 0],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "linear"
              }}
            ></motion.div>
          </motion.div>
        </div>

        {/* Right side - Biryani image placeholder (desktop view) */}
        <div className="hidden lg:flex lg:w-1/2 justify-center">
          <motion.div 
            className="relative"
            animate={{
              y: [0, -10, 0],
              scale: [1, 1.02, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <motion.div 
              className="w-80 h-80 lg:w-96 lg:h-96 rounded-2xl overflow-hidden shadow-2xl border-4 border-primary/20"
              whileHover={{
                scale: 1.05,
                boxShadow: "0 25px 50px rgba(0,0,0,0.25)"
              }}
              transition={{
                duration: 0.3,
                ease: "easeOut"
              }}
            >
              <img 
                src={slides[currentSlide]}
                alt="Delicious Food"
                className="w-full h-full object-cover transition-opacity duration-500"
              />
            </motion.div>
            {/* Decorative elements with animation */}
            <motion.div 
              className="absolute -top-4 -right-4 w-24 h-24 bg-primary rounded-full opacity-20"
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
              className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary rounded-full opacity-10"
              animate={{
                scale: [1, 1.1, 1],
                rotate: [360, 180, 0],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "linear"
              }}
            ></motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
