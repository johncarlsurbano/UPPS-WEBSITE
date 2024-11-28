import React, { useEffect } from 'react';

export const useWebSocket = (url) => {
  useEffect(() => {
    const url = `ws://${url}/ws/socket-server/`;
    const queueConsumer = new WebSocket(url);

    queueConsumer.onmessage = (e) => {
      const data = JSON.parse(e.data);
      console.log('Data:', data);
    };

    queueConsumer.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };

    // Clean up the WebSocket connection when the component unmounts
    return () => {
      queueConsumer.close();
    };
  }, []); // Empty dependency array ensures this runs once on mount

};

