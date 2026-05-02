import React from 'react';
import { useCart } from '../context/CartContext';

const StickyCart = () => {
  const { getTotalItems, getTotalPrice, openCheckout } = useCart();

  // Only show if there are items in cart
  if (getTotalItems() === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-lg text-white shadow-lg z-40 md:hidden border-t border-white/20">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Cart info */}
          <div className="flex items-center">
            <span className="text-2xl mr-3">🛒</span>
            <div>
              <div className="text-sm font-medium">
                {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'}
              </div>
              <div className="text-lg font-bold text-primary">
                ${getTotalPrice().toFixed(2)}
              </div>
            </div>
          </div>

          {/* Checkout button */}
          <button
            onClick={openCheckout}
            className="bg-primary text-white px-6 py-2 rounded-full hover:bg-opacity-90 transition-all font-semibold"
          >
            View Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default StickyCart;
