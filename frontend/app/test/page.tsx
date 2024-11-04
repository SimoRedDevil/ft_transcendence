'use client';

import { useState, useEffect } from "react";

const KeyPressListener = () => {
  
  // This function will be called when the "Enter" key is pressed
  const handleEnterPress = (event) => {
    if (event.key === 'Enter') {
      console.log('Enter key pressed!');
      // Perform the action here
      alert('Enter key was pressed!');
    }
  };

  useEffect(() => {
    // Add event listener for "keydown"
    window.addEventListener('keydown', handleEnterPress);

    // Clean up the event listener when the component is unmounted
    return () => {
      window.removeEventListener('keydown', handleEnterPress);
    };
  }, []); // Empty dependency array ensures this runs once when the component mounts

  return (
    <div className="
        text-center
        bg-gray-100
        p-4
        rounded-lg
        shadow-md
        mt-4
    ">
      <h2>Press the "Enter" key to trigger an action</h2>
    </div>
  );
};

export default KeyPressListener;
