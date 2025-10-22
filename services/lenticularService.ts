import { LenticularImage, LenticularSettings } from '../types';

async function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export async function generateInterlacedImage(
  images: LenticularImage[],
  settings: LenticularSettings
): Promise<string> {
  if (images.length < 2) {
    throw new Error('At least two images are required to generate a lenticular print.');
  }

  const imageElements = await Promise.all(images.map(img => loadImage(img.src)));

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Could not get canvas context');
  }

  const canvasWidth = settings.width * settings.dpi;
  const canvasHeight = settings.height * settings.dpi;
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  
  ctx.imageSmoothingEnabled = false;

  const pixelsPerLens = settings.dpi / settings.lpi;
  const stripWidth = Math.max(1, Math.floor(pixelsPerLens / images.length));
  
  const targetAspectRatio = canvasWidth / canvasHeight;
  
  for (let x = 0; x < canvasWidth; x++) {
    const imageIndex = Math.floor((x / stripWidth)) % images.length;
    const sourceImage = imageElements[imageIndex];
    const sourceAspectRatio = sourceImage.width / sourceImage.height;

    let sx, sy, sWidth, sHeight;

    if (sourceAspectRatio > targetAspectRatio) {
      // Source is wider than target, crop sides
      sHeight = sourceImage.height;
      sWidth = sHeight * targetAspectRatio;
      sx = (sourceImage.width - sWidth) / 2;
      sy = 0;
    } else {
      // Source is taller or same aspect ratio, crop top/bottom
      sWidth = sourceImage.width;
      sHeight = sWidth / targetAspectRatio;
      sy = (sourceImage.height - sHeight) / 2;
      sx = 0;
    }

    // Determine the x-coordinate of the slice within the cropped source area
    const sourceSliceX = sx + (x / canvasWidth) * sWidth;
    // The width of the slice in the source image should be proportional
    const sourceSliceWidth = sWidth / canvasWidth;

    ctx.drawImage(
      sourceImage,
      sourceSliceX, sy,             // source top-left
      sourceSliceWidth, sHeight,    // source dimensions (the slice)
      x, 0,                         // destination top-left
      1, canvasHeight               // destination dimensions (a 1px-wide strip)
    );
  }

  return canvas.toDataURL('image/png');
}

export async function generateTestSheet(settings: LenticularSettings): Promise<string> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Could not get canvas context');
  }
    
  const canvasWidth = settings.width * settings.dpi;
  const canvasHeight = settings.height * settings.dpi;
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // --- Header Text ---
  ctx.fillStyle = 'black';
  ctx.textAlign = 'center';
  const titleFontSize = Math.max(18, settings.dpi / 10);
  ctx.font = `bold ${titleFontSize}px sans-serif`;
  ctx.fillText(`LPI Calibration Sheet`, canvasWidth / 2, titleFontSize * 1.5);
  
  const instructionFontSize = Math.max(12, settings.dpi / 15);
  ctx.font = `${instructionFontSize}px sans-serif`;
  ctx.fillText(`Target LPI: ${settings.lpi} @ ${settings.dpi} DPI`, canvasWidth / 2, titleFontSize * 2.8);
  ctx.fillText(`Place your lenticular sheet over the bands below. The sharpest band indicates the correct LPI.`, canvasWidth / 2, titleFontSize * 2.8 + instructionFontSize * 1.5);

  
  const numBands = 11;
  const lpiRange = 0.5;
  // This calculates step to be 0.1 for 11 bands and a range of 0.5
  const lpiStep = (lpiRange * 2) / (numBands - 1); 
  const contentStartY = titleFontSize * 2.8 + instructionFontSize * 3;
  const bandHeight = (canvasHeight - contentStartY) / numBands;
  
  const labelFontSize = Math.max(10, settings.dpi / 20);
  ctx.font = `${labelFontSize}px sans-serif`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 1;


  for (let i = 0; i < numBands; i++) {
    const currentLpi = (settings.lpi - lpiRange) + (i * lpiStep);
    const bandY = contentStartY + (i * bandHeight);
    
    // Draw band label
    ctx.fillStyle = 'black';
    ctx.fillText(`${currentLpi.toFixed(2)} LPI`, 30, bandY + bandHeight / 2);

    // Draw lines for this LPI
    const pixelsPerLens = settings.dpi / currentLpi;
    for (let x = 0; x < canvasWidth; x += pixelsPerLens) {
        ctx.beginPath();
        ctx.moveTo(x, bandY);
        ctx.lineTo(x, bandY + bandHeight);
        ctx.stroke();
    }
    
    // Draw separator line
    ctx.strokeStyle = '#cccccc';
    ctx.beginPath();
    ctx.moveTo(0, bandY + bandHeight);
    ctx.lineTo(canvasWidth, bandY + bandHeight);
    ctx.stroke();
    ctx.strokeStyle = 'black';
  }
  
  return canvas.toDataURL('image/png');
}