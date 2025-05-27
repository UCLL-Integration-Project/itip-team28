import { StatusMessage } from '@/types';
import React, { useState, useEffect } from 'react';

interface NotificationProps {
    status: 'started' | 'ended' | null;
}

const Notification = ({ messages }: { messages: StatusMessage[] }) => {
  if (messages.length === 0) return null;

  return (
    <div className="fixed top-16 right-4 space-y-2 z-50">
      {messages.map((msg, idx) => (
        <div
          key={idx}
          className={`px-4 py-3 rounded shadow-lg text-white transform transition-transform duration-500 ease-out translate-x-0 ${
            msg.type === 'success' ? 'bg-green-600' : 'bg-red-600'
          }`} 

        >
          {msg.message}
        </div>
      ))}
    </div>
  );
};


export default Notification;