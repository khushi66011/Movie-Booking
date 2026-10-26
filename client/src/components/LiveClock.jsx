import React, { useState, useEffect } from 'react';

const LiveClock = () => {
  const [istTime, setIstTime] = useState('');
  const [istDate, setIstDate] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();

      // Format time in Indian Standard Time (Asia/Kolkata)
      const timeFormatter = new Intl.DateTimeFormat('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      });

      // Format date in Indian Standard Time
      const dateFormatter = new Intl.DateTimeFormat('en-IN', {
        timeZone: 'Asia/Kolkata',
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });

      setIstTime(timeFormatter.format(now));
      setIstDate(dateFormatter.format(now));
    };

    updateTime();
    const intervalId = setInterval(updateTime, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div
      className="d-flex align-items-center gap-2 px-3 py-1 bg-dark bg-opacity-75 border border-secondary border-opacity-50 rounded-pill shadow-sm"
      title="Indian Standard Time (IST, UTC+05:30)"
      style={{ fontSize: '0.82rem', letterSpacing: '0.3px' }}
    >
      <span className="live-clock-pulse"></span>
      <span className="text-warning fw-semibold font-monospace">
        <i className="bi bi-clock me-1"></i>IST: {istTime || '--:--:--'}
      </span>
      <span className="text-secondary d-none d-md-inline">|</span>
      <span className="text-light-50 d-none d-md-inline" style={{ color: '#adb5bd' }}>
        {istDate}
      </span>
    </div>
  );
};

export default LiveClock;

