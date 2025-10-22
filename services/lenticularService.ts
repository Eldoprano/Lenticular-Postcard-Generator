
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
  
  for (let x = 0; x < canvasWidth; x++) {
    const imageIndex = Math.floor((x / stripWidth)) % images.length;
    const sourceImage = imageElements[imageIndex];

    const sx = (x / canvasWidth) * sourceImage.width;

    ctx.drawImage(
      sourceImage,
      sx, 0, 1, sourceImage.height, // source rect (1px wide slice)
      x, 0, 1, canvasHeight       // destination rect
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

  const pixelsPerLens = settings.dpi / settings.lpi;

  ctx.strokeStyle = 'black';
  ctx.lineWidth = 1;

  for (let i = 0; i < settings.lpi * settings.width; i++) {
    const x = i * pixelsPerLens;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvasHeight);
    ctx.stroke();
  }
  
  ctx.fillStyle = 'black';
  ctx.font = `${settings.dpi / 4}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`Test Sheet for ${settings.lpi} LPI @ ${settings.dpi} DPI`, canvasWidth / 2, canvasHeight / 2);
  ctx.fillText(`Each line represents one lens.`, canvasWidth / 2, canvasHeight / 2 + (settings.dpi/4));


  return canvas.toDataURL('image/png');
}
