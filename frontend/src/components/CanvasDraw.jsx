import React, { useRef, useState, useEffect } from 'react';
import { Eraser, Play, Brush } from 'lucide-react';

export default function CanvasDraw({ onAnalyzeCanvas, isLoading }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushSize, setBrushSize] = useState(16);
  const [hasContent, setHasContent] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, []);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      setHasContent(false);
    }
  };

  const startDrawing = (e) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.beginPath();
    }
  };

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height),
    };
  };

  const draw = (e) => {
    if (!isDrawing && e.type !== 'mousedown' && e.type !== 'touchstart') return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { x, y } = getCoordinates(e);

    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#FFFFFF';

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);

    setHasContent(true);
  };

  const handleAnalyze = () => {
    const canvas = canvasRef.current;
    if (canvas && hasContent) {
      const dataUrl = canvas.toDataURL('image/png');
      onAnalyzeCanvas(dataUrl);
    }
  };

  return (
    <div className="canvas-card">
      <div className="card-header">
        <h3><Brush size={18} className="icon-gradient" /> Draw Digit Canvas</h3>
        <span className="badge">Interactive</span>
      </div>

      <div className="canvas-container">
        <canvas
          ref={canvasRef}
          width={280}
          height={280}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="interactive-canvas"
        />
      </div>

      <div className="canvas-controls">
        <div className="brush-controls">
          <label>Brush Size:</label>
          <div className="size-buttons">
            {[10, 16, 24].map((size) => (
              <button
                key={size}
                type="button"
                className={`btn-size ${brushSize === size ? 'active' : ''}`}
                onClick={() => setBrushSize(size)}
              >
                {size === 10 ? 'S' : size === 16 ? 'M' : 'L'}
              </button>
            ))}
          </div>
        </div>

        <div className="action-buttons">
          <button type="button" className="btn-secondary" onClick={clearCanvas}>
            <Eraser size={16} /> Clear
          </button>
          <button
            type="button"
            className="btn-primary"
            onClick={handleAnalyze}
            disabled={!hasContent || isLoading}
          >
            <Play size={16} /> {isLoading ? 'Extracting...' : 'Extract Features'}
          </button>
        </div>
      </div>
    </div>
  );
}
