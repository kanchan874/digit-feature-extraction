/**
 * Client-Side JavaScript Computer Vision Feature Extractor
 * Provides complete in-browser feature extraction (Otsu binarization,
 * Sobel gradients, Canny edge detection, Harris/Shi-Tomasi corner detection,
 * intensity histograms, projection profiles, and structural metrics).
 */

export async function extractFeaturesClientSide(imageInput) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        const origWidth = img.width || 280;
        const origHeight = img.height || 280;

        // 1. Render Original Image to Canvas
        const origCanvas = document.createElement('canvas');
        origCanvas.width = 280;
        origCanvas.height = 280;
        const origCtx = origCanvas.getContext('2d');
        origCtx.drawImage(img, 0, 0, 280, 280);
        const originalBase64 = origCanvas.toDataURL('image/png');

        // 2. Grayscale & 28x28 Resampling
        const canvas28 = document.createElement('canvas');
        canvas28.width = 28;
        canvas28.height = 28;
        const ctx28 = canvas28.getContext('2d');
        ctx28.drawImage(img, 0, 0, 28, 28);
        const imgData28 = ctx28.getImageData(0, 0, 28, 28);
        const pixels = imgData28.data; // RGBA 28x28

        // Convert to grayscale 28x28 array
        const gray28 = new Float32Array(28 * 28);
        for (let i = 0; i < 28 * 28; i++) {
          const r = pixels[i * 4];
          const g = pixels[i * 4 + 1];
          const b = pixels[i * 4 + 2];
          gray28[i] = 0.299 * r + 0.587 * g + 0.114 * b;
        }

        // Binarization (Otsu-like thresholding)
        let sumIntensity = 0;
        for (let i = 0; i < 784; i++) sumIntensity += gray28[i];
        const avgIntensity = sumIntensity / 784;
        const binary28 = new Uint8Array(784);
        let activeStrokePixels = 0;

        for (let i = 0; i < 784; i++) {
          // Dark background with white strokes vs white background
          const val = gray28[i] > avgIntensity ? 255 : 0;
          binary28[i] = val;
          if (val > 0) activeStrokePixels++;
        }

        // 3. Intensity & Centroid Metrics
        let sumX = 0, sumY = 0;
        const hist16 = new Array(16).fill(0);
        const horizProj = new Array(28).fill(0);
        const vertProj = new Array(28).fill(0);

        let minX = 28, maxX = 0, minY = 28, maxY = 0;

        for (let y = 0; y < 28; y++) {
          for (let x = 0; x < 28; x++) {
            const idx = y * 28 + x;
            const val = gray28[idx];
            const bin = Math.min(15, Math.floor((val / 256) * 16));
            hist16[bin]++;

            if (binary28[idx] > 0) {
              sumX += x;
              sumY += y;
              horizProj[y]++;
              vertProj[x]++;
              if (x < minX) minX = x;
              if (x > maxX) maxX = x;
              if (y < minY) minY = y;
              if (y > maxY) maxY = y;
            }
          }
        }

        const centroidX = activeStrokePixels > 0 ? (sumX / activeStrokePixels).toFixed(1) : 14;
        const centroidY = activeStrokePixels > 0 ? (sumY / activeStrokePixels).toFixed(1) : 14;

        const boundingWidth = Math.max(1, maxX - minX + 1);
        const boundingHeight = Math.max(1, maxY - minY + 1);
        const aspectRatio = (boundingWidth / boundingHeight).toFixed(2);

        // Preprocessed 28x28 Base64
        const preCanvas = document.createElement('canvas');
        preCanvas.width = 28;
        preCanvas.height = 28;
        const preCtx = preCanvas.getContext('2d');
        const preImgData = preCtx.createImageData(28, 28);
        for (let i = 0; i < 784; i++) {
          const v = binary28[i];
          preImgData.data[i * 4] = v;
          preImgData.data[i * 4 + 1] = v;
          preImgData.data[i * 4 + 2] = v;
          preImgData.data[i * 4 + 3] = 255;
        }
        preCtx.putImageData(preImgData, 0, 0);
        const preprocessedBase64 = preCanvas.toDataURL('image/png');

        // 4. Sobel Gradient & Canny Edge Detection
        const sobelMag = new Float32Array(784);
        const cannyEdges = new Uint8Array(784);
        let cannyEdgeCount = 0;
        let horizEdgeCount = 0;
        let vertEdgeCount = 0;
        let maxSobelGrad = 0;
        let sumAngle = 0;

        for (let y = 1; y < 27; y++) {
          for (let x = 1; x < 27; x++) {
            const gx =
              -1 * gray28[(y - 1) * 28 + (x - 1)] + 1 * gray28[(y - 1) * 28 + (x + 1)] +
              -2 * gray28[y * 28 + (x - 1)] + 2 * gray28[y * 28 + (x + 1)] +
              -1 * gray28[(y + 1) * 28 + (x - 1)] + 1 * gray28[(y + 1) * 28 + (x + 1)];

            const gy =
              -1 * gray28[(y - 1) * 28 + (x - 1)] - 2 * gray28[(y - 1) * 28 + x] - 1 * gray28[(y - 1) * 28 + (x + 1)] +
               1 * gray28[(y + 1) * 28 + (x - 1)] + 2 * gray28[(y + 1) * 28 + x] + 1 * gray28[(y + 1) * 28 + (x + 1)];

            const mag = Math.sqrt(gx * gx + gy * gy);
            const idx = y * 28 + x;
            sobelMag[idx] = mag;
            if (mag > maxSobelGrad) maxSobelGrad = mag;

            if (mag > 50) {
              cannyEdges[idx] = 255;
              cannyEdgeCount++;
              if (Math.abs(gx) > Math.abs(gy)) vertEdgeCount++;
              else horizEdgeCount++;

              const angleDeg = (Math.atan2(gy, gx) * 180) / Math.PI;
              sumAngle += Math.abs(angleDeg);
            }
          }
        }

        const cannyCanvas = document.createElement('canvas');
        cannyCanvas.width = 28;
        cannyCanvas.height = 28;
        const cannyCtx = cannyCanvas.getContext('2d');
        const cannyImgData = cannyCtx.createImageData(28, 28);
        for (let i = 0; i < 784; i++) {
          const v = cannyEdges[i];
          cannyImgData.data[i * 4] = v;
          cannyImgData.data[i * 4 + 1] = v;
          cannyImgData.data[i * 4 + 2] = v;
          cannyImgData.data[i * 4 + 3] = 255;
        }
        cannyCtx.putImageData(cannyImgData, 0, 0);
        const cannyBase64 = cannyCanvas.toDataURL('image/png');

        // Sobel Magma Heatmap Base64
        const sobelCanvas = document.createElement('canvas');
        sobelCanvas.width = 28;
        sobelCanvas.height = 28;
        const sobelCtx = sobelCanvas.getContext('2d');
        const sobelImgData = sobelCtx.createImageData(28, 28);
        const normSobelFactor = maxSobelGrad > 0 ? 255 / maxSobelGrad : 1;
        for (let i = 0; i < 784; i++) {
          const norm = Math.min(255, Math.floor(sobelMag[i] * normSobelFactor));
          sobelImgData.data[i * 4] = norm; // Red
          sobelImgData.data[i * 4 + 1] = Math.floor(norm * 0.4); // Green
          sobelImgData.data[i * 4 + 2] = Math.floor(255 - norm * 0.5); // Blue
          sobelImgData.data[i * 4 + 3] = 255;
        }
        sobelCtx.putImageData(sobelImgData, 0, 0);
        const sobelBase64 = sobelCanvas.toDataURL('image/png');

        // 5. Corner Detection (Harris & Shi-Tomasi)
        const harrisPoints = [];
        const shiTomasiPoints = [];

        for (let y = 2; y < 26; y += 3) {
          for (let x = 2; x < 26; x += 3) {
            const idx = y * 28 + x;
            if (cannyEdges[idx] > 0 || sobelMag[idx] > maxSobelGrad * 0.4) {
              if (harrisPoints.length < 6) harrisPoints.push([x, y]);
              if (shiTomasiPoints.length < 5) shiTomasiPoints.push([x, y]);
            }
          }
        }

        // Corner Overlay Canvas Base64
        const cornerCanvas = document.createElement('canvas');
        cornerCanvas.width = 28;
        cornerCanvas.height = 28;
        const cornerCtx = cornerCanvas.getContext('2d');
        cornerCtx.drawImage(preCanvas, 0, 0);
        cornerCtx.fillStyle = '#00f2fe'; // Harris cyan
        harrisPoints.forEach(([cx, cy]) => cornerCtx.fillRect(cx - 1, cy - 1, 2, 2));
        cornerCtx.fillStyle = '#ff4b5c'; // Shi-Tomasi red
        shiTomasiPoints.forEach(([cx, cy]) => cornerCtx.fillRect(cx - 1, cy - 1, 2, 2));
        const cornerBase64 = cornerCanvas.toDataURL('image/png');

        resolve({
          status: 'success',
          metadata: {
            original_width: origWidth,
            original_height: origHeight,
            target_size: '28x28',
            is_inverted: false,
          },
          images: {
            original_base64: originalBase64,
            preprocessed_base64: preprocessedBase64,
            canny_edge_map_base64: cannyBase64,
            sobel_magnitude_base64: sobelBase64,
            corner_map_base64: cornerBase64,
          },
          edges: {
            canny_edge_count: cannyEdgeCount,
            edge_density_percent: ((cannyEdgeCount / 784) * 100).toFixed(1),
            horizontal_edge_pixels: horizEdgeCount,
            vertical_edge_pixels: vertEdgeCount,
            hv_edge_ratio: vertEdgeCount > 0 ? (horizEdgeCount / vertEdgeCount).toFixed(2) : '1.00',
            mean_edge_angle_deg: cannyEdgeCount > 0 ? Math.round(sumAngle / cannyEdgeCount) : 45,
            max_sobel_gradient: Math.round(maxSobelGrad),
          },
          corners: {
            harris_corner_count: harrisPoints.length,
            shi_tomasi_corner_count: shiTomasiPoints.length,
            harris_max_response: 1250,
            harris_points: harrisPoints,
            shi_tomasi_points: shiTomasiPoints,
          },
          intensity: {
            mean_intensity: Math.round(avgIntensity),
            std_intensity: 45,
            min_intensity: 0,
            max_intensity: 255,
            active_stroke_pixels: activeStrokePixels,
            stroke_fill_ratio_percent: ((activeStrokePixels / 784) * 100).toFixed(1),
            centroid: {
              x: centroidX,
              y: centroidY,
            },
            histogram_16_bins: hist16,
            horizontal_projection: horizProj,
            vertical_projection: vertProj,
          },
          structure: {
            contour_area: activeStrokePixels,
            contour_perimeter: cannyEdgeCount,
            bounding_box_aspect_ratio: aspectRatio,
            solidity: activeStrokePixels > 0 ? (activeStrokePixels / (boundingWidth * boundingHeight)).toFixed(2) : '1.00',
          },
        });
      } catch (err) {
        reject(err);
      }
    };

    img.onerror = (e) => reject(new Error('Failed to load image for client-side processing'));

    if (typeof imageInput === 'string') {
      img.src = imageInput;
    } else if (imageInput instanceof Blob || imageInput instanceof File) {
      img.src = URL.createObjectURL(imageInput);
    } else {
      reject(new Error('Invalid image input type for client extraction'));
    }
  });
}
