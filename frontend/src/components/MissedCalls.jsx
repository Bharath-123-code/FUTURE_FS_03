import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const MissedCalls = () => {
  const [missedCalls, setMissedCalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMissedCalls();
  }, []);

  const fetchMissedCalls = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://127.0.0.1:8000/api/missed-calls/unresolved/');
      if (!response.ok) {
        throw new Error('Failed to fetch missed calls');
      }
      const data = await response.json();
      setMissedCalls(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resolveMissedCall = async (callId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/missed-calls/${callId}/resolve/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to resolve missed call');
      }
      
      // Remove the resolved call from the list
      setMissedCalls(prev => prev.filter(call => call.id !== callId));
    } catch (err) {
      setError(err.message);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="fixed top-20 right-4 z-50 w-80">
        <div className="chalkboard-card rounded-lg p-4 border-l-4 border-red-500">
          <div className="flex items-center space-x-2">
            <div className="animate-pulse w-2 h-2 bg-red-500 rounded-full"></div>
            <span className="text-white text-sm">Loading missed calls...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed top-20 right-4 z-50 w-80">
        <div className="chalkboard-card rounded-lg p-4 border-l-4 border-red-500">
          <p className="text-red-400 text-sm">Error: {error}</p>
        </div>
      </div>
    );
  }

  if (missedCalls.length === 0) {
    return null; // Don't show anything if no missed calls
  }

  return (
    <div className="fixed top-20 right-4 z-50 w-80">
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        className="chalkboard-card rounded-lg border-l-4 border-red-500 max-h-96 overflow-y-auto"
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-semibold flex items-center">
              <span className="text-red-500 mr-2">📞</span>
              Missed Calls ({missedCalls.length})
            </h3>
            <button
              onClick={fetchMissedCalls}
              className="text-white/60 hover:text-white text-sm"
            >
              🔄
            </button>
          </div>
          
          <div className="space-y-2">
            {missedCalls.map((call) => (
              <motion.div
                key={call.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/5 rounded p-3 border border-white/10"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-cream font-medium text-sm">
                        {call.waiter_name}
                      </span>
                      <span className="text-white/60 text-xs">
                        • {formatTime(call.created_at)}
                      </span>
                    </div>
                    <div className="text-white/80 text-xs mb-1">
                      📱 {call.phone_number}
                    </div>
                    {call.order_table && (
                      <div className="text-white/60 text-xs">
                        Table {call.order_table}
                      </div>
                    )}
                    <div className="text-red-400 text-xs mt-1">
                      {call.reason || 'Call failed'}
                    </div>
                  </div>
                  <button
                    onClick={() => resolveMissedCall(call.id)}
                    className="ml-2 px-2 py-1 bg-green-500/20 hover:bg-green-500/30 text-green-400 text-xs rounded border border-green-500/30 transition-colors"
                  >
                    Resolve
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MissedCalls;
