
import React, { useState, useRef, useEffect } from 'react';
import { LenticularImage, LenticularSettings } from '../types';
import { generateInterlacedImage } from '../services/lenticularService';

interface LenticularPreviewProps {
  images: LenticularImage[];
  settings: LenticularSettings;
}

const LenticularPreview: React.FC<LenticularPreviewProps> = ({ images, settings }) => {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const [viewMode, setViewMode] = useState<'3d' | '2d'>('3d');
  const [interlacedImageUrl, setInterlacedImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    // Preload images to prevent flickering
    images.forEach(image => {
      const img = new Image();
      img.src = image.src;
    });
  }, [images]);

  useEffect(() => {
    if (images.length < 2) {
      setInterlacedImageUrl(null);
      return;
    }

    let isCancelled = false;
    const generate = async () => {
      setIsGenerating(true);
      try {
        const url = await generateInterlacedImage(images, settings);
        if (!isCancelled) {
          setInterlacedImageUrl(url);
        }
      } catch (error) {
        console.error("Failed to generate 2D preview:", error);
        if (!isCancelled) {
          setInterlacedImageUrl(null);
        }
      } finally {
        if (!isCancelled) {
          setIsGenerating(false);
        }
      }
    };

    generate();

    return () => {
      isCancelled = true;
    };
  }, [images, settings]);


  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const midX = rect.width / 2;
    const midY = rect.height / 2;

    const maxRotation = 25; // degrees

    const rotateY = ((x - midX) / midX) * maxRotation;
    const rotateX = ((y - midY) / midY) * -maxRotation;

    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
  };

  const aspectRatio = settings.width / settings.height;
  
  const opacities = new Array(images.length).fill(0);
  if (images.length > 0) {
      const maxRotation = 25;
      const normalizedY = (rotation.y + maxRotation) / (maxRotation * 2);
      const floatIndex = Math.max(0, Math.min(images.length - 1, normalizedY * (images.length - 1)));
      
      const index1 = Math.floor(floatIndex);
      const index2 = Math.ceil(floatIndex);
      
      if (index1 === index2) {
          opacities[index1] = 1;
      } else {
          const fraction = floatIndex - index1;
          if (opacities[index1] !== undefined) opacities[index1] = 1 - fraction;
          if (opacities[index2] !== undefined) opacities[index2] = fraction;
      }
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={viewMode === '3d' ? handleMouseMove : undefined}
      onMouseLeave={viewMode === '3d' ? handleMouseLeave : undefined}
      className="w-full h-full flex items-center justify-center p-8 relative"
      style={viewMode === '3d' ? { perspective: '1000px' } : {}}
    >
      <div className="absolute top-4 right-12 z-10 bg-light-bg/80 dark:bg-dark-bg/80 backdrop-blur-sm p-1 rounded-lg flex gap-1 shadow-md">
            <button 
                onClick={() => setViewMode('3d')} 
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${viewMode === '3d' 
                    ? 'bg-light-primary text-white dark:bg-dark-primary' 
                    : 'text-light-fg dark:text-dark-fg hover:bg-light-bg-hover dark:hover:bg-dark-bg-hover'}`}
            >
                3D Preview
            </button>
            <button 
                onClick={() => setViewMode('2d')} 
                disabled={images.length < 2}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${viewMode === '2d' 
                    ? 'bg-light-primary text-white dark:bg-dark-primary' 
                    : 'text-light-fg dark:text-dark-fg hover:bg-light-bg-hover dark:hover:bg-dark-bg-hover'}`}
            >
                2D Print
            </button>
        </div>

        {viewMode === '3d' ? (
            <div
                className="relative w-full max-w-[600px] bg-light-bg-alt dark:bg-dark-bg-alt rounded-xl shadow-2xl transition-transform duration-100 ease-out flex items-center justify-center overflow-hidden"
                style={{
                aspectRatio: `${aspectRatio}`,
                transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
                transformStyle: 'preserve-3d',
                }}
            >
                {images.length > 0 ? (
                    images.map((image, index) => (
                        <img
                            key={image.id}
                            src={image.src}
                            alt={`Lenticular layer ${index}`}
                            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                            style={{ 
                                opacity: opacities[index],
                                backfaceVisibility: 'hidden',
                            }}
                        />
                    ))
                ) : (
                <div className="text-center p-4 text-light-fg dark:text-dark-fg">
                    <h3 className="text-xl font-semibold">Your postcard will appear here</h3>
                    <p className="mt-2 opacity-70">Upload some images and move your mouse over this area to see the effect.</p>
                </div>
                )}
            </div>
        ) : (
            <div
                className="relative w-full max-w-[600px] bg-light-bg-alt dark:bg-dark-bg-alt rounded-xl shadow-2xl flex items-center justify-center overflow-hidden"
                style={{ aspectRatio: `${aspectRatio}` }}
            >
                {isGenerating && (
                    <div className="text-center p-4 text-light-fg dark:text-dark-fg">
                        <p>Generating print preview...</p>
                    </div>
                )}
                {!isGenerating && interlacedImageUrl && (
                     <img
                        src={interlacedImageUrl}
                        alt="Interlaced print preview"
                        className="w-full h-full object-cover"
                    />
                )}
                 {!isGenerating && !interlacedImageUrl && images.length > 1 && (
                     <div className="text-center p-4 text-red-500">
                        <p>Could not generate print preview.</p>
                    </div>
                 )}
                {images.length < 2 && (
                    <div className="text-center p-4 text-light-fg dark:text-dark-fg">
                        <h3 className="text-xl font-semibold">2D Print Preview</h3>
                        <p className="mt-2 opacity-70">Upload at least two images to generate the print file.</p>
                    </div>
                )}
            </div>
        )}
    </div>
  );
};

export default LenticularPreview;
