import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Loader({ message = "Extracting Computer Vision Features..." }) {
  return (
    <div className="loader-overlay">
      <div className="loader-box">
        <Loader2 size={36} className="spinner" />
        <p className="loader-text">{message}</p>
      </div>
    </div>
  );
}
