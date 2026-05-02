import React from 'react';
import { motion } from 'framer-motion';

const Contact = () => {
  return (
    <div className="min-h-screen bg-transparent py-20 px-6">
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-serif text-white mb-4 decorative-underline">
            Contact Us
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
            Get in touch with us for any questions or inquiries
          </p>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Email */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-xl p-8 text-center hover:shadow-2xl transition-all duration-300"
          >
            <div className="text-6xl mb-4">📧</div>
            <h3 className="text-2xl font-serif-bold text-deep-charcoal mb-4">Email Us</h3>
            <p className="text-gray-600 text-lg mb-4">Send us an email for any inquiries</p>
            <a
              href="mailto:sangabharath302@gmail.com"
              className="text-black hover:text-primary text-xl font-semibold transition-colors"
            >
              sangabharath302@gmail.com
            </a>
          </motion.div>

          {/* Phone */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-2xl shadow-xl p-8 text-center hover:shadow-2xl transition-all duration-300"
          >
            <div className="text-6xl mb-4">📱</div>
            <h3 className="text-2xl font-serif-bold text-deep-charcoal mb-4">Call Us</h3>
            <p className="text-gray-600 text-lg mb-4">Give us a call for immediate assistance</p>
            <a
              href="tel:1234567890"
              className="text-black hover:text-primary text-xl font-semibold transition-colors"
            >
              1234567890
            </a>
          </motion.div>
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12 text-center"
        >
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-serif-bold text-deep-charcoal mb-4">Business Hours</h3>
            <div className="text-gray-600 space-y-2">
              <p>Monday - Friday: 9:00 AM - 10:00 PM</p>
              <p>Saturday - Sunday: 10:00 AM - 11:00 PM</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;