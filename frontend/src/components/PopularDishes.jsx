import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import Skeleton from './Skeleton';
import { fetchMenuItems } from '../api';
import { useSearch } from '../context/SearchContext';

const PopularDishes = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { searchQuery, searchResults } = useSearch();

  const transformToProduct = (menuItem, index) => {
    const imageUrl = `/Images/img${(index % 6) + 1}.jpg`;
    return {
      id: menuItem.id,
      image: imageUrl,
      price: parseFloat(menuItem.price),
      title: menuItem.name,
      description: menuItem.description,
      badge: menuItem.tag || '',
      rating: parseFloat(menuItem.rating) || 4.5,
      review_count: menuItem.review_count || 0
    };
  };

  useEffect(() => {
    const loadMenuItems = async () => {
      try {
        setLoading(true);
        
        if (searchQuery && searchResults.length > 0) {
          const transformedSearchResults = searchResults.slice(0, 6).map((item, index) => transformToProduct(item, index));
          setMenuItems(transformedSearchResults);
        } else {
          const data = await fetchMenuItems();
          
          if (data && data.length > 0) {
            const popularItems = data.slice(0, 6).map((item, index) => transformToProduct(item, index));
            setMenuItems(popularItems);
          } else {
            const fallbackPopularDishes = [
              {
                id: 1,
                name: "Classic Burger",
                price: 12.99,
                description: "Juicy beef patty with lettuce, tomato, and special sauce",
                tag: "Popular",
                rating: 4.5,
                review_count: 128
              },
              {
                id: 2,
                name: "Margherita Pizza",
                price: 14.99,
                description: "Fresh mozzarella, tomato sauce, and basil on crispy dough",
                tag: "Chef Special",
                rating: 4.8,
                review_count: 256
              },
              {
                id: 3,
                name: "Caesar Salad",
                price: 8.99,
                description: "Crisp romaine lettuce with parmesan and croutons",
                tag: "Healthy",
                rating: 4.3,
                review_count: 89
              },
              {
                id: 4,
                name: "Grilled Chicken",
                price: 16.99,
                description: "Tender grilled chicken with herbs and vegetables",
                tag: "Grilled",
                rating: 4.6,
                review_count: 167
              },
              {
                id: 5,
                name: "Chocolate Dessert",
                price: 7.99,
                description: "Rich chocolate cake with vanilla frosting",
                tag: "Sweet",
                rating: 4.7,
                review_count: 198
              },
              {
                id: 6,
                name: "Garlic Bread",
                price: 5.99,
                description: "Toasted garlic bread with herbs and melted butter",
                tag: "Appetizer",
                rating: 4.4,
                review_count: 112
              }
            ];
            const popularItems = fallbackPopularDishes.map((item, index) => transformToProduct(item, index));
            setMenuItems(popularItems);
          }
        }
      } catch (err) {
        setError('Failed to load popular dishes');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadMenuItems();
  }, [searchQuery, searchResults]);

  if (loading) {
    return (
      <section className="py-12 px-6 bg-gradient-to-br from-purple-50 via-cream to-pink-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-dark mb-8 text-center">🍜 Popular Dishes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-primary/10">
                <Skeleton className="h-48 w-full" />
                <div className="p-4">
                  <Skeleton variant="text" className="h-6 w-3/4 mb-2" />
                  <Skeleton variant="text" className="h-4 w-full mb-2" />
                  <Skeleton variant="text" className="h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 px-6 bg-gradient-to-br from-purple-50 via-cream to-pink-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-dark mb-8 text-center">🍜 Popular Dishes</h2>
          <div className="text-center text-red-500">{error}</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-6 bg-transparent backdrop-blur-sm">
      <div className="container mx-auto relative z-10">
        <h2 className="text-4xl font-serif bg-gradient-to-r from-navy-blue via-primary to-terracotta bg-clip-text text-transparent mb-8 text-center decorative-underline">🍜 Popular Dishes</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularDishes;
