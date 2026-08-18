import React, { useState } from 'react';
import {
  Sparkles,
  Layers,
  Activity,
  Maximize2,
  Sliders,
  Target,
  Compass,
} from 'lucide-react';
import HistogramChart from './HistogramChart';

export default function FeatureDisplay({ features }) {
  const [activeTab, setActiveTab] = useState('all');

  if (!features) {
    return (
      <div className="placeholder-card">
        <Sparkles size={48} className="placeholder-icon" />
        <h3>No Digit Selected</h3>
        <p>Draw a digit on the canvas, upload an image file, or click a preset sample (0-9) to extract computer vision features.</p>
      </div>
    );
  }

  const { images, edges, corners, intensity, structure, metadata } = features;

  return (
    <div className="feature-results-dashboard">
      {/* Metrics Stat Header */}
      <div className="stat-cards-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper cyan"><Layers size={20} /></div>
          <div>
            <span className="stat-label">Canny Edge Pixels</span>
            <h3 className="stat-value">{edges?.canny_edge_count || 0}</h3>
            <span className="stat-sub">Density: {edges?.edge_density_percent}%</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper magenta"><Target size={20} /></div>
          <div>
            <span className="stat-label">Shi-Tomasi Corners</span>
            <h3 className="stat-value">{corners?.shi_tomasi_corner_count || 0}</h3>
            <span className="stat-sub">Harris Count: {corners?.harris_corner_count || 0}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper purple"><Activity size={20} /></div>
          <div>
            <span className="stat-label">Mean Intensity</span>
            <h3 className="stat-value">{intensity?.mean_intensity || 0}</h3>
            <span className="stat-sub">Fill Ratio: {intensity?.stroke_fill_ratio_percent}%</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper amber"><Compass size={20} /></div>
          <div>
            <span className="stat-label">Centroid (X, Y)</span>
            <h3 className="stat-value">({intensity?.centroid?.x}, {intensity?.centroid?.y})</h3>
            <span className="stat-sub">Solidity: {structure?.solidity || 0}</span>
          </div>
        </div>
      </div>

      {/* Visual Feature Maps Grid */}
      <div className="feature-maps-container">
        <div className="section-title">
          <Maximize2 size={18} /> Visual Feature Maps & Computer Vision Filters
        </div>

        <div className="maps-grid">
          <div className="map-card">
            <span className="map-tag">Source</span>
            <div className="map-img-box">
              <img src={images?.original_base64} alt="Original Input" />
            </div>
            <h4>Original Input</h4>
            <p className="map-desc">{metadata?.original_width}x{metadata?.original_height} px</p>
          </div>

          <div className="map-card">
            <span className="map-tag">Preprocessed</span>
            <div className="map-img-box">
              <img src={images?.preprocessed_base64} alt="Preprocessed 28x28" />
            </div>
            <h4>Otsu Binarized</h4>
            <p className="map-desc">28x28 centered binary</p>
          </div>

          <div className="map-card">
            <span className="map-tag canny">Edge Map</span>
            <div className="map-img-box">
              <img src={images?.canny_edge_map_base64} alt="Canny Edge Detection" />
            </div>
            <h4>Canny Edge Detector</h4>
            <p className="map-desc">{edges?.canny_edge_count} edge pixels</p>
          </div>

          <div className="map-card">
            <span className="map-tag sobel">Sobel Gradient</span>
            <div className="map-img-box">
              <img src={images?.sobel_magnitude_base64} alt="Sobel Magnitude Map" />
            </div>
            <h4>Sobel Gradient Energy</h4>
            <p className="map-desc">Magma Gradient Heatmap</p>
          </div>

          <div className="map-card">
            <span className="map-tag corner">Corner Keypoints</span>
            <div className="map-img-box">
              <img src={images?.corner_map_base64} alt="Corner Keypoints" />
            </div>
            <h4>Harris & Shi-Tomasi</h4>
            <p className="map-desc">Cyan: Harris | Red: Shi-Tomasi</p>
          </div>
        </div>
      </div>

      {/* Detailed Feature Tab Navigation */}
      <div className="tabs-container">
        <div className="tabs-header">
          <button
            className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All Features & Charts
          </button>
          <button
            className={`tab-btn ${activeTab === 'edges' ? 'active' : ''}`}
            onClick={() => setActiveTab('edges')}
          >
            Edge Features
          </button>
          <button
            className={`tab-btn ${activeTab === 'corners' ? 'active' : ''}`}
            onClick={() => setActiveTab('corners')}
          >
            Corner Coordinates
          </button>
          <button
            className={`tab-btn ${activeTab === 'intensity' ? 'active' : ''}`}
            onClick={() => setActiveTab('intensity')}
          >
            Intensity & Structure
          </button>
        </div>

        <div className="tab-content">
          {(activeTab === 'all' || activeTab === 'intensity') && (
            <HistogramChart
              histogramData={intensity?.histogram_16_bins}
              horizontalProj={intensity?.horizontal_projection}
              verticalProj={intensity?.vertical_projection}
            />
          )}

          {(activeTab === 'all' || activeTab === 'edges') && (
            <div className="details-card">
              <h4><Sliders size={16} /> Edge Extraction Numerical Metrics</h4>
              <div className="metrics-table-wrapper">
                <table className="metrics-table">
                  <thead>
                    <tr>
                      <th>Feature Property</th>
                      <th>Extracted Value</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Total Canny Edges</td>
                      <td><strong>{edges?.canny_edge_count}</strong></td>
                      <td>Count of boundary pixels detected by Canny operator</td>
                    </tr>
                    <tr>
                      <td>Edge Density</td>
                      <td><strong>{edges?.edge_density_percent}%</strong></td>
                      <td>Ratio of edge pixels to total image pixels (784)</td>
                    </tr>
                    <tr>
                      <td>H / V Edge Ratio</td>
                      <td><strong>{edges?.hv_edge_ratio}</strong></td>
                      <td>Horizontal vs Vertical Sobel energy ratio</td>
                    </tr>
                    <tr>
                      <td>Max Sobel Gradient</td>
                      <td><strong>{edges?.max_sobel_gradient}</strong></td>
                      <td>Peak directional intensity change rate</td>
                    </tr>
                    <tr>
                      <td>Mean Edge Angle</td>
                      <td><strong>{edges?.mean_edge_angle_deg}°</strong></td>
                      <td>Average stroke orientation angle in degrees</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {(activeTab === 'all' || activeTab === 'corners') && (
            <div className="details-card">
              <h4><Target size={16} /> Keypoint Coordinate Breakdown</h4>
              <div className="corner-coords-grid">
                <div className="coord-box">
                  <h5>Shi-Tomasi Points ({corners?.shi_tomasi_points?.length || 0})</h5>
                  <div className="coord-chips">
                    {(corners?.shi_tomasi_points || []).map((pt, idx) => (
                      <span key={idx} className="chip red">({pt[0]}, {pt[1]})</span>
                    ))}
                    {(!corners?.shi_tomasi_points || corners?.shi_tomasi_points.length === 0) && (
                      <span className="sub-text">No sharp corners detected</span>
                    )}
                  </div>
                </div>

                <div className="coord-box">
                  <h5>Harris Points ({corners?.harris_points?.length || 0})</h5>
                  <div className="coord-chips">
                    {(corners?.harris_points || []).map((pt, idx) => (
                      <span key={idx} className="chip cyan">({pt[0]}, {pt[1]})</span>
                    ))}
                    {(!corners?.harris_points || corners?.harris_points.length === 0) && (
                      <span className="sub-text">No Harris corners detected</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
