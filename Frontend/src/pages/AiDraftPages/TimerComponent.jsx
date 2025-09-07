import React, { useState, useEffect } from 'react';

const TimerComponent = ({ expiryTime, onExpire, title = "Time Remaining", showAlerts = true }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (!expiryTime) return;

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const expiry = new Date(expiryTime).getTime();
      const difference = expiry - now;

      if (difference <= 0) {
        setTimeLeft(0);
        setIsExpired(true);
        if (onExpire) onExpire();
        return 0;
      } else {
        setIsExpired(false);
        return Math.floor(difference / 1000);
      }
    };

    // Initial calculation
    const initialTimeLeft = calculateTimeLeft();
    setTimeLeft(initialTimeLeft);

    // Set up interval
    const interval = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);

      // Show alerts at specific time intervals
      if (showAlerts && newTimeLeft > 0) {
        if (newTimeLeft === 300) { // 5 minutes
          alert('Warning: 5 minutes remaining!');
        } else if (newTimeLeft === 60) { // 1 minute
          alert('Warning: 1 minute remaining!');
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiryTime, onExpire, showAlerts]);

  const formatTime = (seconds) => {
    if (seconds <= 0) return '00:00:00';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeColor = () => {
    if (isExpired) return 'text-red-600';
    if (timeLeft <= 300) return 'text-red-600'; // Last 5 minutes
    if (timeLeft <= 900) return 'text-orange-600'; // Last 15 minutes
    return 'text-green-600';
  };

  const getBackgroundColor = () => {
    if (isExpired) return 'bg-red-50 border-red-200';
    if (timeLeft <= 300) return 'bg-red-50 border-red-200';
    if (timeLeft <= 900) return 'bg-orange-50 border-orange-200';
    return 'bg-green-50 border-green-200';
  };

  if (!expiryTime) return null;

  return (
    <div className={`p-4 rounded-lg border ${getBackgroundColor()}`}>
      <div className="flex items-center justify-center">
        <div className="text-center">
          <div className="text-sm font-medium text-gray-700 mb-1">{title}</div>
          <div className={`text-2xl font-mono font-bold ${getTimeColor()}`}>
            {formatTime(timeLeft)}
          </div>
          {isExpired && (
            <div className="text-red-600 text-sm mt-1 font-semibold">EXPIRED</div>
          )}
          {!isExpired && timeLeft <= 300 && (
            <div className="text-red-600 text-xs mt-1 animate-pulse">
              ⚠️ Expiring soon!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimerComponent;
