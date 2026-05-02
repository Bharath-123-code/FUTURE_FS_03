import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fetchOrderById } from '../api';

const OrderTracking = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Define order steps and their status mapping
  const orderSteps = [
    { id: 1, name: 'Order Placed', status: 'Pending', icon: '📝' },
    { id: 2, name: 'Waiter Notified', status: 'Pending', icon: '📱' },
    { id: 3, name: 'Preparing', status: 'Accepted', icon: '👨‍🍳' },
    { id: 4, name: 'Served', status: 'Completed', icon: '✅' }
  ];

  // Get current step based on order status
  const getCurrentStep = (orderStatus) => {
    switch (orderStatus) {
      case 'Pending':
        return 1; // Order Placed
      case 'Accepted':
        return 3; // Skip to Preparing (waiter notified automatically)
      case 'Completed':
        return 4; // Served
      default:
        return 1;
    }
  };

  // Fetch order status
  const fetchOrderStatus = async () => {
    try {
      const orderData = await fetchOrderById(orderId);
      setOrder(orderData);
      setError(null);
    } catch (err) {
      setError('Failed to fetch order status');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Initial load and set up polling
  useEffect(() => {
    if (orderId) {
      fetchOrderStatus();
      
      // Set up polling every 10 seconds
      const interval = setInterval(() => {
        fetchOrderStatus();
      }, 10000);

      return () => clearInterval(interval);
    }
  }, [orderId]);

  // Pulsing animation for active step
  const pulseAnimation = {
    scale: [1, 1.05, 1],
    opacity: [1, 0.8, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <div className="relative z-10 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary/30 border-t-primary mx-auto mb-4"></div>
          <p className="text-gray-700 font-semibold">Loading your order...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <div className="relative z-10 text-center">
          <div className="text-5xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-6">{error || 'Order not found'}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-primary to-orange-500 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all font-semibold"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const currentStep = getCurrentStep(order.status);
  const isCompleted = order.status === 'Completed';

  return (
    <div className="min-h-screen bg-transparent py-20 px-6">
      <div className="container mx-auto max-w-2xl relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-dark mb-4">
            Order Tracking
          </h1>
          <p className="text-gray-600">
            Order #{order.id} • Table {order.table_number}
          </p>
        </div>

        {/* Order Completed Message */}
        {isCompleted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-green-50 border border-green-200 rounded-lg p-6 text-center mb-8"
          >
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-green-800 mb-2">
              Enjoy your meal!
            </h2>
            <p className="text-green-600">
              Your order has been served. Thank you for dining at SpiceHub!
            </p>
          </motion.div>
        )}

        {/* Progress Stepper */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="space-y-8">
            {orderSteps.map((step, index) => {
              const isActive = step.id === currentStep && !isCompleted;
              const isCompleted = step.id < currentStep || isCompleted;
              const isUpcoming = step.id > currentStep;

              return (
                <div key={step.id} className="flex items-center">
                  {/* Step Circle */}
                  <motion.div
                    className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold ${
                      isCompleted
                        ? 'bg-green-500 text-white'
                        : isActive
                        ? 'bg-primary text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                    animate={isActive ? pulseAnimation : {}}
                  >
                    {isCompleted ? '✓' : step.icon}
                  </motion.div>

                  {/* Step Content */}
                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between">
                      <h3
                        className={`text-lg font-semibold ${
                          isCompleted
                            ? 'text-green-600'
                            : isActive
                            ? 'text-primary'
                            : 'text-gray-400'
                        }`}
                      >
                        {step.name}
                      </h3>
                      {isActive && (
                        <motion.span
                          className="text-sm text-primary font-medium"
                          animate={pulseAnimation}
                        >
                          In Progress...
                        </motion.span>
                      )}
                      {isCompleted && (
                        <span className="text-sm text-green-600 font-medium">
                          Completed
                        </span>
                      )}
                    </div>
                    
                    {/* Step Description */}
                    <p className="text-gray-600 text-sm mt-1">
                      {step.id === 1 && 'Your order has been received and is being processed.'}
                      {step.id === 2 && 'The waiter has been notified and will prepare your order.'}
                      {step.id === 3 && 'Your order is being prepared in the kitchen.'}
                      {step.id === 4 && 'Your order has been served to your table.'}
                    </p>
                  </div>

                  {/* Connector Line */}
                  {index < orderSteps.length - 1 && (
                    <div className="absolute left-6 mt-12 w-0.5 h-8">
                      <div
                        className={`w-full h-full ${
                          step.id < currentStep || isCompleted
                            ? 'bg-green-500'
                            : 'bg-gray-200'
                        }`}
                      ></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Order Details */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-dark mb-4">Order Details</h3>
            <div className="space-y-2">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {item.quantity}x {item.name}
                  </span>
                  <span className="font-medium">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
              <div className="pt-2 mt-2 border-t border-gray-200">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span className="text-primary">
                    ${order.total_price.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate('/')}
              className="flex-1 bg-primary text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-all"
            >
              Order More Food
            </button>
            {!isCompleted && (
              <button
                onClick={() => window.location.reload()}
                className="flex-1 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-all"
              >
                Refresh Status
              </button>
            )}
          </div>
        </div>

        {/* Auto-refresh indicator */}
        {!isCompleted && (
          <div className="text-center mt-4 text-sm text-gray-500">
            Auto-refreshing every 10 seconds...
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTracking;
