import React from 'react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

const Menu = ({ setShowMenu }) => {
  const { addToCart, removeFromCart, cartItems } = useCart();
  const { showSuccess } = useToast();

  const menuItems = [
    { id: 1, name: 'Classic Burger', price: 12.99, description: 'Juicy beef patty with lettuce, tomato, and special sauce', image: '/Images/Burger.jpg', category: 'Main Course' },
    { id: 2, name: 'Margherita Pizza', price: 14.99, description: 'Fresh mozzarella, tomato sauce, and basil on crispy dough', image: '/Images/pizza.jpg', category: 'Main Course' },
    { id: 3, name: 'Caesar Salad', price: 8.99, description: 'Crisp romaine lettuce with parmesan and croutons', image: '/Images/salads.jpg', category: 'Salads' },
    { id: 4, name: 'Tomato Soup', price: 6.99, description: 'Creamy tomato soup with fresh basil and croutons', image: '/Images/soups.webp', category: 'Soups' },
    { id: 5, name: 'Chocolate Dessert', price: 7.99, description: 'Rich chocolate cake with vanilla frosting', image: '/Images/Desserts.jpg', category: 'Desserts' },
    { id: 6, name: 'Garlic Bread', price: 5.99, description: 'Toasted garlic bread with herbs and melted butter', image: '/Images/starter.jpg', category: 'Starters' },
    { id: 7, name: 'Fresh Lemonade', price: 3.99, description: 'Freshly squeezed lemonade with mint', image: '/Images/Beverage.jpg', category: 'Beverages' },
    { id: 8, name: 'Grilled Chicken', price: 16.99, description: 'Tender grilled chicken with herbs and vegetables', image: '/Images/main course.jpg', category: 'Main Course' },
    { id: 9, name: 'Special Pizza', price: 18.99, description: 'Chef special pizza with premium toppings', image: '/Images/pizza.jpg', category: 'Main Course' },
    { id: 10, name: 'Pasta Primavera', price: 15.99, description: 'Fresh pasta with seasonal vegetables', image: '/Images/main course.jpg', category: 'Main Course' },
    { id: 11, name: 'Fish Tacos', price: 13.99, description: 'Crispy fish tacos with slaw and lime', image: '/Images/Burger.jpg', category: 'Main Course' },
    { id: 12, name: 'Veggie Wrap', price: 11.99, description: 'Fresh vegetables wrapped in tortilla', image: '/Images/salads.jpg', category: 'Main Course' },
    { id: 13, name: 'Fruit Smoothie', price: 9.99, description: 'Mixed berry smoothie with yogurt', image: '/Images/Beverage.jpg', category: 'Beverages' },
    { id: 14, name: 'Steak Dinner', price: 24.99, description: 'Grilled steak with mashed potatoes', image: '/Images/main course.jpg', category: 'Main Course' },
    { id: 15, name: 'Seafood Platter', price: 28.99, description: 'Assorted seafood with lemon butter', image: '/Images/starter.jpg', category: 'Main Course' }
  ];

  const handleCartAction = (item) => {
    const isInCart = cartItems.some(cartItem => cartItem.id === item.id);
    if (isInCart) {
      removeFromCart(item.id);
      showSuccess(`${item.name} removed from cart!`);
    } else {
      addToCart(item);
      showSuccess(`${item.name} added to cart!`);
    }
  };

  return (
    <div className="min-h-screen bg-transparent py-20 px-6">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <button
            onClick={() => setShowMenu(false)}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary to-orange-500 hover:shadow-lg text-white rounded-full mb-6 transition-all font-semibold"
          >
            ← Back to Home
          </button> <br />

          <h1 className="text-4xl md:text-6xl font-serif text-white mb-4 decorative-underline">
            Our Menu
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
            Discover our delicious selection of dishes made with the finest ingredients
          </p>
        </div>

        {/* Menu Stats */}
        <div className="text-center mb-8">
          <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary to-orange-500 text-white rounded-full text-sm font-semibold shadow-lg">
            ⭐ {menuItems.length} Items Available
          </span>
        </div>

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {menuItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group transform hover:-translate-y-2 border-2 border-primary/10 hover:border-primary/30"
            >
              {/* Image */}
              <div className="relative h-48 bg-gradient-to-br from-orange-100 via-pink-50 to-yellow-100 overflow-hidden border-b-4 border-primary/20">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* Category Badge */}
                <div className="absolute top-3 right-3 bg-gradient-to-r from-primary to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg drop-shadow-lg">
                  {item.category}
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-serif-bold text-deep-charcoal group-hover:text-primary transition-colors">
                    {item.name}
                  </h3>
                  <span className="text-primary font-bold text-xl">
                    ${item.price}
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>

                {/* Add to Cart Button */}
                <button
                  onClick={() => handleCartAction(item)}
                  className="w-full bg-gradient-to-r from-primary to-orange-500 text-white py-3 px-4 rounded-xl hover:shadow-lg hover:shadow-primary/50 transition-all flex items-center justify-center font-semibold min-h-[44px] group-hover:shadow-xl"
                >
                  <span className="text-lg mr-2">{cartItems.some(cartItem => cartItem.id === item.id) ? '❌' : '🛒'}</span>
                  <span>{cartItems.some(cartItem => cartItem.id === item.id) ? 'Remove from Cart' : 'Add to Cart'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Menu;
