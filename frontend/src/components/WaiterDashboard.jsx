import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchWaiterById, fetchWaiterOrders, completeOrder, fetchAvailableWaiters } from '../api';

const WaiterDashboard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [waiter, setWaiter] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [completingOrderId, setCompletingOrderId] = useState(null);

  // Load waiter data and orders
  const loadData = async () => {
    try {
      setLoading(true);
      
      // Fetch waiter details
      const waiterData = await fetchWaiterById(id);
      setWaiter(waiterData);
      
      // Fetch waiter's orders
      const ordersData = await fetchWaiterOrders(id);
      setOrders(ordersData);
      
      setError(null);
    } catch (err) {
      setError('Failed to load waiter dashboard');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle order completion
  const handleCompleteOrder = async (orderId) => {
    try {
      setCompletingOrderId(orderId);
      await completeOrder(orderId);
      
      // Reload data to reflect changes
      await loadData();
      
      // Also trigger real-time update for available waiters
      try {
        await fetchAvailableWaiters();
      } catch (err) {
        console.error('Failed to refresh available waiters:', err);
      }
      
    } catch (err) {
      setError('Failed to complete order');
      console.error(err);
    } finally {
      setCompletingOrderId(null);
    }
  };

  // Format order time
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Accepted':
        return 'bg-blue-100 text-blue-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Initial load
  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id]);

  // Set up polling for real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (id) {
        loadData();
      }
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <div className="relative z-10 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary/30 border-t-primary mx-auto mb-4"></div>
          <p className="text-gray-700 font-semibold">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !waiter) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600 mb-6">{error || 'Waiter not found'}</p>
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

  return (
    <div className="min-h-screen bg-transparent">
      {/* Header */}
      <div className="bg-gradient-to-r from-navy-blue via-dark to-navy-blue text-white py-6 px-6 border-b-4 border-primary shadow-xl relative z-20">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-1">👨‍💼 {waiter.name}'s Dashboard</h1>
              <p className="text-blue-100">📱 Phone: {waiter.phone_number}</p>
            </div>
            <div className="text-right bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <div className="text-sm text-blue-200">Current Orders</div>
              <div className="text-4xl font-bold bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">
                {waiter.current_orders} / {waiter.max_capacity}
              </div>
              <div className={`text-sm mt-2 font-semibold ${
                waiter.is_available ? 'text-green-300' : 'text-red-300'
              }`}>
                {waiter.is_available ? '✅ Available' : '🔴 Busy'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Section */}
      <div className="container mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold text-dark mb-6">Assigned Orders</h2>
        
        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Active Orders</h3>
            <p className="text-gray-500">You don't have any assigned orders at the moment.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  {/* Order Info */}
                  <div className="flex-1 mb-4 md:mb-0">
                    <div className="flex items-center gap-4 mb-3">
                      <h3 className="text-lg font-semibold text-dark">
                        Table {order.table_number}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                      <span className="text-sm text-gray-500">
                        {formatTime(order.created_at)}
                      </span>
                    </div>
                    
                    {/* Order Items */}
                    <div className="mb-3">
                      <div className="text-sm font-medium text-gray-700 mb-2">Items:</div>
                      <div className="space-y-1">
                        {order.items.map((item, index) => (
                          <div key={index} className="text-sm text-gray-600">
                            {item.quantity}x {item.name} - ${(item.price * item.quantity).toFixed(2)}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Total */}
                    <div className="text-lg font-bold text-primary">
                      Total: ${order.total_price.toFixed(2)}
                    </div>
                  </div>

                  {/* Action Button */}
                  {order.status === 'Accepted' && (
                    <div className="flex-shrink-0">
                      <button
                        onClick={() => handleCompleteOrder(order.id)}
                        disabled={completingOrderId === order.id}
                        className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                      >
                        {completingOrderId === order.id ? 'Completing...' : 'Complete Order'}
                      </button>
                    </div>
                  )}
                  
                  {order.status === 'Pending' && (
                    <div className="flex-shrink-0">
                      <div className="bg-yellow-100 text-yellow-800 px-6 py-3 rounded-lg font-semibold">
                        Waiting for Acceptance
                      </div>
                    </div>
                  )}
                  
                  {order.status === 'Completed' && (
                    <div className="flex-shrink-0">
                      <div className="bg-green-100 text-green-800 px-6 py-3 rounded-lg font-semibold">
                        ✓ Completed
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Auto-refresh indicator */}
        <div className="mt-8 text-center text-sm text-gray-500">
          Auto-refreshing every 30 seconds...
        </div>
      </div>
    </div>
  );
};

export default WaiterDashboard;
