// src/components/Loader.tsx
import React from 'react';
import './style.scss';

const Loader: React.FC = () => {
  return (
    <div className="app-loader">
      <div className="spinner" />
      <span>Loading...</span>
    </div>
  );
};

export default Loader;
