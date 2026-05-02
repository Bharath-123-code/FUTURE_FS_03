import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { fetchAvailableWaiters, createOrder } from '../api';

const CheckoutModal = ({ setShowMenu }) => {
  const navigate = useNavigate();
  const { 
    cartItems, 
    getTotalPrice, 
    getTotalItems, 
    clearCart, 
    closeCheckout,
    isCheckoutOpen,
    removeFromCart
  } = useCart();

  const [tableNumber, setTableNumber] = useState('');
  const [selectedWaiter, setSelectedWaiter] = useState(null);
  const [availableWaiters, setAvailableWaiters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [notifyMe, setNotifyMe] = useState(false);
  const [estimatedWaitMinutes, setEstimatedWaitMinutes] = useState(15);
  const [notificationPolling, setNotificationPolling] = useState(null);

  const selectedWaiterDetails = availableWaiters.find((waiter) => waiter.id === selectedWaiter);
  const selectedWaiterPhone = selectedWaiterDetails?.phone_number || selectedWaiterDetails?.phone;

  // Load available waiters when modal opens
  useEffect(() => {
    if (isCheckoutOpen) {
      loadAvailableWaiters();
    }
  }, [isCheckoutOpen]);

  const loadAvailableWaiters = async () => {
    try {
      setLoading(true);
      const waiters = await fetchAvailableWaiters();
      const requiredMinWaiters = 5;
      const mockWaiters = [
        { id: 101, name: 'Alice Johnson', experience_years: 3, current_orders: 1, max_capacity: 5, phone_number: '+917780180901' },
        { id: 102, name: 'Bob Smith', experience_years: 5, current_orders: 2, max_capacity: 6, phone_number: '+917780180902' },
        { id: 103, name: 'Charlie Brown', experience_years: 2, current_orders: 0, max_capacity: 4, phone_number: '+917780180903' },
        { id: 104, name: 'Diana Prince', experience_years: 4, current_orders: 1, max_capacity: 5, phone_number: '+917780180904' },
        { id: 105, name: 'Edward Norton', experience_years: 6, current_orders: 3, max_capacity: 7, phone_number: '+917780180905' },
        { id: 106, name: 'Mike Davis', experience_years: 3, current_orders: 1, max_capacity: 5, phone_number: '+916300803463' }
      ];
      const filledWaiters = [...waiters];
      if (filledWaiters.length < requiredMinWaiters) {
        const extraMock = mockWaiters.filter(mock => !filledWaiters.some(waiter => waiter.id === mock.id));
        filledWaiters.push(...extraMock.slice(0, requiredMinWaiters - filledWaiters.length));
      }
      setAvailableWaiters(filledWaiters);
      
      // Calculate estimated wait time based on availability
      if (filledWaiters.length === 0) {
        // Estimate wait time (could be made more sophisticated)
        const estimatedMinutes = Math.max(10, Math.floor(Math.random() * 20) + 10);
        setEstimatedWaitMinutes(estimatedMinutes);
      }
      
      setError('');
    } catch (err) {
      console.error('Error fetching waiters:', err);
      // Fallback to mock waiters
      const mockWaiters = [
        { id: 101, name: 'Alice Johnson', experience_years: 3, current_orders: 1, max_capacity: 5, phone_number: '+917780180901' },
        { id: 102, name: 'Bob Smith', experience_years: 5, current_orders: 2, max_capacity: 6, phone_number: '+917780180902' },
        { id: 103, name: 'Charlie Brown', experience_years: 2, current_orders: 0, max_capacity: 4, phone_number: '+917780180903' },
        { id: 104, name: 'Diana Prince', experience_years: 4, current_orders: 1, max_capacity: 5, phone_number: '+917780180904' },
        { id: 105, name: 'Edward Norton', experience_years: 6, current_orders: 3, max_capacity: 7, phone_number: '+917780180905' },
        { id: 106, name: 'Mike Davis', experience_years: 3, current_orders: 1, max_capacity: 5, phone_number: '+916300803463' }
      ];
      setAvailableWaiters(mockWaiters);
      setError('');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!tableNumber) {
      setError('Please select a table number');
      return;
    }

    if (!selectedWaiter && availableWaiters.length > 0) {
      setError('Please select a waiter');
      return;
    }

    if (availableWaiters.length === 0) {
      setError('All our staff are currently busy. Please wait a moment.');
      return;
    }

    try {
      setLoading(true);
      
      // Prepare order data
      const orderData = {
        table_number: parseInt(tableNumber),
        items: cartItems.map(item => ({
          id: item.id,
          name: item.title,
          price: item.price,
          quantity: item.quantity
        })),
        total_price: getTotalPrice(),
        assigned_waiter: selectedWaiter,
        status: 'Pending'
      };

      // Create order
      const createdOrder = await createOrder(orderData);
      
      // Success
      setOrderPlaced(true);
      clearCart();
      
      // Redirect to home after 2 seconds
      setTimeout(() => {
        closeCheckout();
        resetForm();
        setShowMenu(false);
        navigate('/');
      }, 2000);

    } catch (err) {
      setError('Failed to place order. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Request notification permission and start polling
  const handleNotifyMe = async () => {
    // Request browser notification permission
    if ('Notification' in window) {
      if (Notification.permission === 'default') {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
          // Fallback to toast notification
          showToastNotification('Please enable browser notifications for instant alerts!');
        }
      }
    }

    setNotifyMe(true);
    startNotificationPolling();
    showToastNotification(`We'll notify you when a waiter becomes available!`);
  };

  // Start polling for waiter availability
  const startNotificationPolling = () => {
    // Clear any existing polling
    if (notificationPolling) {
      clearInterval(notificationPolling);
    }

    // Start new polling interval
    const interval = setInterval(async () => {
      try {
        const waiters = await fetchAvailableWaiters();
        setAvailableWaiters(waiters);
        
        // If waiters become available, notify user
        if (waiters.length > 0 && notifyMe) {
          sendWaiterAvailableNotification();
          setNotifyMe(false);
          clearInterval(interval);
          setNotificationPolling(null);
        }
      } catch (err) {
        console.error('Error polling for waiters:', err);
      }
    }, 10000); // Check every 10 seconds

    setNotificationPolling(interval);
  };

  // Send notification when waiter becomes available
  const sendWaiterAvailableNotification = () => {
    const message = 'Good news! A waiter is now available for your order.';
    
    // Browser notification
    if ('Notification' in window && Notification.permission === 'granted') {
      const notification = new Notification('SpiceHub - Waiter Available', {
        body: message,
        icon: '/favicon.ico',
        tag: 'waiter-available'
      });
      
      // Auto-close after 5 seconds
      setTimeout(() => notification.close(), 5000);
    }
    
    // Toast notification fallback
    showToastNotification(message);
  };

  // Simple toast notification fallback
  const showToastNotification = (message) => {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 bg-primary text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-pulse';
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // Remove after 3 seconds
    setTimeout(() => {
      if (document.body.contains(toast)) {
        document.body.removeChild(toast);
      }
    }, 3000);
  };

  // Cleanup polling when modal closes
  useEffect(() => {
    return () => {
      if (notificationPolling) {
        clearInterval(notificationPolling);
      }
    };
  }, [notificationPolling]);

  const resetForm = () => {
    setTableNumber('');
    setSelectedWaiter(null);
    setError('');
    setOrderPlaced(false);
    setNotifyMe(false);
    if (notificationPolling) {
      clearInterval(notificationPolling);
      setNotificationPolling(null);
    }
  };

  const handleClose = () => {
    closeCheckout();
    resetForm();
  };

  if (!isCheckoutOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="chalkboard-card rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border-4 border-primary/20 relative z-50">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-primary to-orange-500 text-white border-b-4 border-primary px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold">🛒 Checkout</h2>
          <button
            onClick={handleClose}
            className="text-white hover:bg-white/20 rounded-full w-8 h-8 flex items-center justify-center text-2xl transition-all"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {orderPlaced ? (
            <div className="text-center py-8">
              <div className="text-green-500 text-6xl mb-4">✓</div>
              <h3 className="text-2xl font-semibold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">Order Placed Successfully!</h3>
              <p className="text-gray-600 text-lg">Your order has been sent to the kitchen.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Cart Summary */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">📦 Order Summary</h3>
                <div className="chalkboard-card rounded-xl p-4 border-2 border-white/20">
                  {cartItems.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0 border-white/10">
                      <div className="flex-1">
                        <span className="font-medium text-white">{item.title}</span>
                        <span className="text-white/60 ml-2">× {item.quantity}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-cream">${(item.price * item.quantity).toFixed(2)}</span>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-400 hover:text-red-300 text-lg font-bold"
                          title="Remove item"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-3 mt-3 border-t border-white/20">
                    <span className="font-semibold text-lg text-white">Total:</span>
                    <span className="font-bold text-xl text-cream">${getTotalPrice().toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Table Number Selection */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  🪑 Table Number *
                </label>
                <select
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cream bg-white text-black"
                  required
                >
                  <option value="">Select a table</option>
                  {[...Array(20)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      Table {i + 1}
                    </option>
                  ))}
                </select>
              </div>

              {/* Waiter Selection */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Choose Your Waiter *
                </label>
                {loading ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cream"></div>
                  </div>
                ) : availableWaiters.length === 0 ? (
                  <div className="space-y-4">
                    {/* Busy Banner */}
                    <div className="chalkboard-card border border-cream/30 rounded-lg p-4">
                      <div className="flex items-center justify-center mb-2">
                        <span className="text-2xl mr-2">⏱️</span>
                        <p className="text-cream text-center font-medium">
                          Our team is currently at full capacity. Your table will be prioritized in approximately {estimatedWaitMinutes} minutes.
                        </p>
                      </div>
                    </div>
                    
                    {/* Notify Me Button */}
                    {!notifyMe ? (
                      <button
                        onClick={handleNotifyMe}
                        className="w-full bg-primary text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-all font-semibold"
                      >
                        🔔 Notify Me When Available
                      </button>
                    ) : (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
                          <span className="text-blue-800 text-sm">
                            Monitoring availability... We'll notify you when a waiter becomes available!
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {availableWaiters.map((waiter) => (
                      <label
                        key={waiter.id}
                        className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-cream transition-colors"
                      >
                        <input
                          type="radio"
                          name="waiter"
                          value={waiter.id}
                          checked={selectedWaiter === waiter.id}
                          onChange={(e) => setSelectedWaiter(parseInt(e.target.value))}
                          className="mr-3"
                        />
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3">
                            <span className="font-medium">{waiter.name}</span>
                            {(waiter.phone_number || waiter.phone) && (
                              <span className="text-sm text-white/70">{waiter.phone_number || waiter.phone}</span>
                            )}
                          </div>
                          <span className="text-gray-600">
                            Current orders: {waiter.current_orders}/{waiter.max_capacity}
                          </span>
                        </div>
                        <span className="text-green-500 text-sm">Available</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {selectedWaiterDetails && (
                <div className="bg-slate-900/80 border border-white/20 rounded-xl p-4 mb-4 text-white">
                  <p className="font-medium">Waiter selected: {selectedWaiterDetails.name}</p>
                  {selectedWaiterPhone && (
                    <p className="text-sm text-white/70">Mobile: {selectedWaiterPhone}</p>
                  )}
                  <p className="text-sm mt-2">
                    After placing the order, your waiter will receive a call from +917780180734 with the order details.
                  </p>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || availableWaiters.length === 0}
                  className="flex-1 bg-primary text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Placing Order...' : 'Place Order'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
