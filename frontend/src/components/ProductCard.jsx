import React from 'react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

const ProductCard = ({ product }) => {
  const { image, price, title, description, badge, rating, review_count } = product;
  const { addToCart } = useCart();
  const { showSuccess } = useToast();

  const getBadgeColor = (badge) => {
    switch (badge) {
      case 'Bestseller':
        return 'bg-green-500';
      case 'Spicy':
        return 'bg-red-500';
      case 'New':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleAddToCart = () => {
    console.log('ProductCard: handleAddToCart called for:', title);
    console.log('ProductCard: product object:', product);
    console.log('ProductCard: calling addToCart');
    addToCart(product);
    console.log('ProductCard: calling showSuccess');
    showSuccess(`${title} added to cart!`);
    console.log('ProductCard: add to cart completed');
  };

  // Food image selection: use explicit product image first, then infer from title
  const getFoodImage = (title, explicitImage) => {
    if (explicitImage) {
      return explicitImage;
    }

    const normalized = (title || '').toLowerCase();
    if (normalized.includes('burger')) return '/Images/Burger.jpg';
    if (normalized.includes('pizza')) return '/Images/pizza.jpg';
    if (normalized.includes('salad')) return '/Images/salads.jpg';
    if (normalized.includes('soup')) return '/Images/soups.webp';
    if (normalized.includes('dessert') || normalized.includes('cake')) return '/Images/Desserts.jpg';
    if (normalized.includes('drink') || normalized.includes('smoothie') || normalized.includes('lemonade') || normalized.includes('beverage')) return '/Images/Beverage.jpg';
    if (normalized.includes('starter') || normalized.includes('garlic') || normalized.includes('bread')) return '/Images/starter.jpg';
    if (normalized.includes('chicken') || normalized.includes('steak') || normalized.includes('seafood') || normalized.includes('biryani') || normalized.includes('main course') || normalized.includes('pasta')) return '/Images/main course.jpg';
    return '/Images/main course.jpg';
  };

  const displayImage = getFoodImage(title, image);

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group transform hover:-translate-y-2 border-2 border-primary/10 hover:border-primary/30">
      {/* Badge on top left */}
      {badge && (
        <div className={`absolute top-3 left-3 z-10 bg-gradient-to-r ${getBadgeColor(badge) === 'bg-green-500' ? 'from-green-400 to-emerald-500' : getBadgeColor(badge) === 'bg-red-500' ? 'from-red-400 to-rose-500' : 'from-blue-400 to-indigo-500'} text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg drop-shadow-md`}>
          {badge}
        </div>
      )}
      
      {/* Product Image */}
      <div className="relative h-56 bg-gradient-to-br from-orange-100 via-yellow-50 to-pink-100 overflow-hidden border-b-4 border-primary/20">
        <img
          src={displayImage}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      
      {/* Product Info */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg md:text-xl font-serif-bold text-deep-charcoal">{title}</h3>
          <span className="text-primary font-bold text-lg md:text-xl">${price}</span>
        </div>
        
        {/* Rating */}
        {rating && (
          <div className="flex items-center mb-2">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}>
                  ★
                </span>
              ))}
            </div>
            <span className="text-sm text-gray-600 ml-2">
              {rating} ({review_count || 0} reviews)
            </span>
          </div>
        )}
        
        <p className="text-gray-600 text-xs md:text-sm mb-4 line-clamp-2">{description}</p>
        
        {/* Add to cart button - larger for mobile */}
        <button 
          onClick={handleAddToCart}
          className="w-full bg-gradient-to-r from-primary to-orange-500 text-white py-3 md:py-2 px-4 rounded-xl hover:shadow-lg hover:shadow-primary/50 transition-all flex items-center justify-center text-base md:text-sm font-semibold min-h-[44px]"
        >
          <span className="text-xl md:text-lg mr-2">🛒</span>
          <span className="text-sm md:text-sm">Add to Cart</span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
