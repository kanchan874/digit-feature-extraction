# Feature Extraction from Handwritten Digits — Full Stack Application

A full-stack MVC computer vision application for extracting, visualizing, and analyzing features from handwritten digit images (edges, corners, intensity distribution, stroke projections, and morphological shape descriptors).

![Python](https://img.shields.io/badge/Python-3.13-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.141-green)
![OpenCV](https://img.shields.io/badge/OpenCV-4.8+-red)
![React](https://img.shields.io/badge/React-18-cyan)
![Vite](https://img.shields.io/badge/Vite-5.0-purple)

---

## 🌟 Key Features

1. **Model Layer (Computer Vision Algorithms)**:
   - **Preprocessing**: Grayscale conversion, Gaussian denoising, auto background inversion, Otsu binarization, and 28x28 centering.
   - **Edge Extraction**: Canny edge detection & Sobel gradient magnitude maps, edge density %, H/V edge energy ratio, max gradient, and mean orientation angle.
   - **Corner Extraction**: Harris corner response matrix & Shi-Tomasi keypoint detection with coordinate mapping and keypoint overlay maps.
   - **Intensity & Projections**: 16-bin intensity distribution histogram, centroid $(X, Y)$, stroke fill ratio %, horizontal & vertical stroke projection profiles, contour area, perimeter, and solidity.

2. **View Layer (Interactive React Dashboard)**:
   - **Interactive Drawing Canvas**: Draw any digit directly with mouse/touch using custom brush sizes and analyze features live.
   - **File Upload Zone**: Drag-and-drop or browse custom digit images (PNG/JPG/BMP).
   - **MNIST Sample Preset Gallery**: One-click digit selector (0–9) for instant testing.
   - **Visual Maps Carousel**: Side-by-side comparison of original, preprocessed, Canny edge map, Sobel magnitude heatmap, and corner keypoint overlay.
   - **Interactive Recharts Charts**: Intensity distribution bar chart and row/column stroke projection area chart.
   - **Glassmorphism Dark Theme**: Modern UI aesthetics with glowing accent badges and smooth micro-animations.

3. **Controller Layer (FastAPI REST API)**:
   - `/api/extract-features`: Multipart file upload feature extraction endpoint.
   - `/api/extract-features-base64`: Base64 canvas drawing feature extraction endpoint.
   - `/api/sample-images`: Built-in sample gallery endpoints.

4. **Notebooks & Tests**:
   - `notebooks/feature_extraction_experiments.ipynb`: Interactive Jupyter Notebook with step-by-step OpenCV code blocks and Matplotlib plots.
   - `tests/`: Automated unit test suite using `pytest`.

---

## 📁 Directory Structure

```
digit-feature-extraction/
│
├── backend/
│   ├── app.py                      # FastAPI entry point
│   ├── requirements.txt            # Python dependencies
│   ├── controllers/
│   │   ├── feature_controller.py   # Aggregates preprocessing, edge, corner, intensity pipelines
│   │   └── upload_controller.py    # File upload validation handler
│   ├── models/                     # OpenCV / NumPy feature extraction core
│   │   ├── preprocessing.py        # Otsu thresholding, Gaussian blur, centering & resize
│   │   ├── edge_extractor.py       # Canny edge & Sobel gradient maps
│   │   ├── corner_extractor.py     # Harris & Shi-Tomasi keypoint extraction
│   │   └── intensity_extractor.py  # Histogram, centroid, projections, and contours
│   ├── routes/
│   │   └── api_routes.py           # API route definitions
│   ├── utils/
│   │   ├── image_utils.py          # Base64 & OpenCV array conversion helpers
│   │   └── validators.py           # Upload file validation
│   └── static/
│       └── samples/                # Sample digit images (0-9)
│
├── frontend/                       # React (Vite) Single Page Application
│   ├── src/
│   │   ├── App.jsx                 # Dashboard shell
│   │   ├── components/
│   │   │   ├── CanvasDraw.jsx      # Interactive digit drawing canvas
│   │   │   ├── UploadForm.jsx      # File upload & preset digit picker
│   │   │   ├── FeatureDisplay.jsx  # Visual feature maps & metric tabs
│   │   │   ├── HistogramChart.jsx  # Recharts intensity & projection charts
│   │   │   └── Loader.jsx          # Extraction progress spinner
│   │   ├── services/
│   │   │   └── api.js              # Axios API service
│   │   └── styles/
│   │       └── App.css             # Glassmorphism dark styling
│   ├── index.html
│   └── package.json
│
├── dataset/
│   └── mnist_samples/              # Sample digit PNGs (digits 0-9)
│
├── notebooks/
│   └── feature_extraction_experiments.ipynb  # Interactive Jupyter Notebook
│
├── tests/
│   ├── test_preprocessing.py
│   ├── test_edge_extractor.py
│   ├── test_corner_extractor.py
│   ├── test_intensity_extractor.py
│   └── test_api.py
│
├── scripts/
│   └── generate_samples.py         # Sample digit generator script
│
└── README.md
```

---

## 🚀 How to Run the Application

### 1. Start the Backend API (FastAPI)

Open a terminal in the root directory:

```bash
# Install Python dependencies
pip install -r backend/requirements.txt

# Start FastAPI server on port 8000
python -m uvicorn backend.app:app --reload --port 8000
```

The API interactive Swagger documentation will be available at: [http://localhost:8000/docs](http://localhost:8000/docs)

### 2. Start the Frontend (React + Vite)

Open a second terminal window:

```bash
# Navigate to frontend folder
cd frontend

# Install Node dependencies
npm install

# Start Vite development server
npm run dev
```

Open your browser at: [http://localhost:5173](http://localhost:5173)

---

## 🧪 Running Automated Tests

Run the backend Pytest test suite:

```bash
python -m pytest tests/
```

---

## 📊 Jupyter Notebook

To run the feature extraction experiments notebook:

```bash
jupyter notebook notebooks/feature_extraction_experiments.ipynb
```
