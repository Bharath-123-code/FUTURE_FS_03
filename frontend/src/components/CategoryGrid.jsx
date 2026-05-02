import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fetchCategories } from '../api';
import Skeleton from './Skeleton';

const CategoryGrid = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Icon mapping for categories
  const getCategoryIcon = (categoryName) => {
    const icons = {
      'Starters': '🥟',
      'Main Course': '🍛',
      'Pizza': '🍕',
      'Burgers': '🍔',
      'Beverages': '🥤',
      'Desserts': '🍰',
      'Salads': '🥗',
      'Soups': '🍲',
    };
    return icons[categoryName] || '�️';
  };

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        const data = await fetchCategories();
        setCategories(data);
      } catch (err) {
        setError('Failed to load categories');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  if (loading) {
    return (
      <section className="py-20 px-6 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-serif text-white mb-8 text-center decorative-underline">Categories</h2>
          <div className="flex space-x-3 md:grid md:grid-cols-5 md:gap-6 md:space-x-0 min-w-max md:min-w-0">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="chalkboard-card rounded-lg p-4 md:p-6 text-center min-w-[140px] md:min-w-0 flex-shrink-0">
                <Skeleton variant="circular" className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4" />
                <Skeleton variant="text" className="h-4 w-20 mx-auto mb-2" />
                <Skeleton variant="text" className="h-3 w-16 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 px-6 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-serif text-white mb-8 text-center decorative-underline">Categories</h2>
          <div className="text-center text-red-400">
            <p className="text-lg">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-6 bg-transparent backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <h2 className="text-4xl font-serif text-white mb-8 text-center decorative-underline">Categories</h2>
        
        {/* Horizontal scroll container for mobile, grid for desktop */}
        <div className="relative">
          {/* Scroll indicators for mobile */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none md:hidden"></div>
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none md:hidden"></div>
          
          <div className="overflow-x-auto pb-4 px-2 md:px-0 scrollbar-hide">
            <div className="flex space-x-3 md:grid md:grid-cols-5 md:gap-6 md:space-x-0 min-w-max md:min-w-0">
              {categories.map((category, index) => {
                const colors = [
                  'from-primary to-orange-400',
                  'from-sage-green to-green-400',
                  'from-terracotta to-red-400',
                  'from-blue-500 to-indigo-400',
                  'from-purple-500 to-pink-400'
                ];
                return (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.5, 
                      delay: index * 0.1,
                      ease: "easeOut"
                    }}
                    whileHover={{ scale: 1.05 }}
                    className="chalkboard-card rounded-2xl p-4 md:p-6 text-center hover:shadow-2xl transition-all duration-300 cursor-pointer min-w-[140px] md:min-w-0 flex-shrink-0"
                  >
                    <div className="text-3xl md:text-5xl mb-3 md:mb-4">{getCategoryIcon(category.name)}</div>
                    <h3 className="text-sm md:text-lg font-semibold mb-1 md:mb-2 text-white">{category.name}</h3>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
