import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <div className="min-h-screen bg-transparent py-20 px-6">
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-serif text-white mb-4 decorative-underline">
            About Us
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
            Discover the story behind SpiceHub and our passion for exceptional dining
          </p>
        </div>

        {/* About Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Our Story */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <div className="text-6xl mb-4">📖</div>
            <h3 className="text-2xl font-serif-bold text-deep-charcoal mb-4">Our Story</h3>
            <p className="text-gray-600 text-lg leading-relaxed">
              Founded in 2026, SpiceHub began as a small family-owned restaurant with a big dream.
              We believe that great food brings people together, and every dish we serve is crafted
              with love, using the finest ingredients and traditional cooking techniques passed
              down through generations.
            </p>
          </motion.div>

          {/* Our Mission */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-2xl font-serif-bold text-deep-charcoal mb-4">Our Mission</h3>
            <p className="text-gray-600 text-lg leading-relaxed">
              To create memorable dining experiences by combining authentic flavors with modern
              innovation. We strive to make every meal special, whether it's a quick lunch or a
              celebratory dinner, ensuring our customers leave with full hearts and satisfied palates.
            </p>
          </motion.div>
        </div>

        {/* Values */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-8"
        >
          <h3 className="text-2xl font-serif-bold text-deep-charcoal mb-6 text-center">Our Values</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-2">🌱</div>
              <h4 className="font-semibold text-lg mb-2">Quality</h4>
              <p className="text-gray-600">Only the finest ingredients make it to your plate</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">❤️</div>
              <h4 className="font-semibold text-lg mb-2">Passion</h4>
              <p className="text-gray-600">Every dish is prepared with love and dedication</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">🌍</div>
              <h4 className="font-semibold text-lg mb-2">Community</h4>
              <p className="text-gray-600">Building connections through shared meals</p>
            </div>
          </div>
        </motion.div>

        {/* Team */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center"
        >
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-serif-bold text-deep-charcoal mb-4">Meet Our Team</h3>
            <p className="text-gray-600 text-lg mb-6">
              Our talented chefs and staff work together to bring you an unforgettable dining experience.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="text-4xl mb-2">👨‍🍳</div>
                <h4 className="font-semibold">Chef Marco</h4>
                <p className="text-gray-600">Head Chef</p>
              </div>
              <div>
                <div className="text-4xl mb-2">👩‍🍳</div>
                <h4 className="font-semibold">Chef Sarah</h4>
                <p className="text-gray-600">Sous Chef</p>
              </div>
              <div>
                <div className="text-4xl mb-2">🤵</div>
                <h4 className="font-semibold">John</h4>
                <p className="text-gray-600">Restaurant Manager</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;