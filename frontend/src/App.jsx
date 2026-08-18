import React, { useState } from 'react';
import { Sparkles, Brain, Cpu, FileCode, ExternalLink } from 'lucide-react';
import CanvasDraw from './components/CanvasDraw';
import UploadForm from './components/UploadForm';
import FeatureDisplay from './components/FeatureDisplay';
import Loader from './components/Loader';
import {
  extractFeaturesFromFile,
  extractFeaturesFromCanvas,
  extractSampleDigitFeatures,
} from './services/api';
import './styles/App.css';

export default function App() {
  const [features, setFeatures] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileUpload = async (file) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await extractFeaturesFromFile(file);
      setFeatures(data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'Failed to extract features from uploaded file.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCanvasAnalyze = async (base64Data) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await extractFeaturesFromCanvas(base64Data);
      setFeatures(data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'Failed to extract features from canvas.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSample = async (digit) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await extractSampleDigitFeatures(digit);
      setFeatures(data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || `Failed to extract features for sample digit ${digit}.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      {/* Top Navbar */}
      <header className="app-header">
        <div className="header-brand">
          <div className="brand-logo">
            <Cpu size={24} />
          </div>
          <div>
            <h1>MultiScaleVision AI</h1>
            <p className="brand-subtitle">Handwritten Digit Feature Extraction Engine</p>
          </div>
        </div>
        <div className="header-actions">
          <span className="badge-status">
            <span className="status-dot"></span> Backend Live (FastAPI + OpenCV)
          </span>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <main className="app-main">
        {error && (
          <div className="error-banner">
            <p>{error}</p>
            <button onClick={() => setError(null)}>Dismiss</button>
          </div>
        )}

        <div className="workspace-grid">
          {/* Left Panel: Input Controls (Canvas + Upload & Presets) */}
          <aside className="control-panel">
            <CanvasDraw onAnalyzeCanvas={handleCanvasAnalyze} isLoading={isLoading} />
            <UploadForm
              onFileUpload={handleFileUpload}
              onSelectSample={handleSelectSample}
              isLoading={isLoading}
            />
          </aside>

          {/* Right Panel: Results & Analytics Dashboard */}
          <section className="results-panel">
            {isLoading && <Loader message="Executing OpenCV & NumPy Extraction Algorithms..." />}
            <FeatureDisplay features={features} />
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>Digit Feature Extraction System — Computer Vision & Machine Learning Pipeline</p>
      </footer>
    </div>
  );
}
