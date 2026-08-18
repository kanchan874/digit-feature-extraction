import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
} from 'recharts';
import { BarChart3, TrendingUp } from 'lucide-react';

export default function HistogramChart({ histogramData, horizontalProj, verticalProj }) {
  if (!histogramData) return null;

  // Format horizontal & vertical projection data for Recharts
  const horizData = (horizontalProj || []).map((val, idx) => ({
    row: `R${idx}`,
    pixels: val,
  }));

  const vertData = (verticalProj || []).map((val, idx) => ({
    col: `C${idx}`,
    pixels: val,
  }));

  return (
    <div className="charts-grid">
      {/* Intensity Histogram */}
      <div className="chart-card">
        <div className="chart-header">
          <h4><BarChart3 size={16} /> Pixel Intensity Distribution (16 Bins)</h4>
        </div>
        <div className="chart-body">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={histogramData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2d3d" />
              <XAxis dataKey="bin" stroke="#8b949e" tick={{ fontSize: 10 }} angle={-30} textAnchor="end" />
              <YAxis stroke="#8b949e" tick={{ fontSize: 10 }} />
              <Tooltip
                contentStyle={{ background: '#161b22', borderColor: '#30363d', color: '#f0f6fc' }}
              />
              <Bar dataKey="count" fill="#8884d8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Projection Profiles */}
      <div className="chart-card">
        <div className="chart-header">
          <h4><TrendingUp size={16} /> Row & Column Stroke Projection Profiles</h4>
        </div>
        <div className="chart-body">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={vertData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2d3d" />
              <XAxis dataKey="col" stroke="#8b949e" tick={{ fontSize: 9 }} interval={3} />
              <YAxis stroke="#8b949e" tick={{ fontSize: 10 }} />
              <Tooltip
                contentStyle={{ background: '#161b22', borderColor: '#30363d', color: '#f0f6fc' }}
              />
              <Area type="monotone" dataKey="pixels" stroke="#00f2fe" fill="#00f2fe" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
