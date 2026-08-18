import React, { useState } from 'react';
import { UploadCloud, Image as ImageIcon, Grid } from 'lucide-react';

export default function UploadForm({ onFileUpload, onSelectSample, isLoading }) {
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setFileName(file.name);
      onFileUpload(file);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name);
      onFileUpload(file);
    }
  };

  return (
    <div className="upload-card">
      <div className="card-header">
        <h3><UploadCloud size={18} className="icon-gradient" /> Upload & Presets</h3>
        <span className="badge">Dataset & Custom</span>
      </div>

      <div
        className={`drop-zone ${dragActive ? 'active' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="file-upload-input"
          accept="image/*"
          onChange={handleChange}
          style={{ display: 'none' }}
        />
        <label htmlFor="file-upload-input" className="drop-zone-label">
          <ImageIcon size={36} className="drop-icon" />
          <p className="primary-text">
            {fileName ? `Selected: ${fileName}` : 'Drag & drop image file here'}
          </p>
          <p className="sub-text">Supports PNG, JPG, JPEG, BMP (Max 10MB)</p>
          <span className="btn-browse">Browse Image</span>
        </label>
      </div>

      <div className="preset-section">
        <h4><Grid size={15} /> Quick Test - MNIST Samples (Digits 0 - 9)</h4>
        <div className="digit-preset-grid">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
            <button
              key={digit}
              type="button"
              className="btn-digit-preset"
              onClick={() => onSelectSample(digit)}
              disabled={isLoading}
            >
              {digit}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
