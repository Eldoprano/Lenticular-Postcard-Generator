
import React, { useState, useRef } from 'react';
import { LenticularImage } from '../types';
import { XIcon } from './icons';

interface ImageListProps {
  images: LenticularImage[];
  setImages: React.Dispatch<React.SetStateAction<LenticularImage[]>>;
}

const ImageList: React.FC<ImageListProps> = ({ images, setImages }) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragEnter = (index: number) => {
    dragOverItem.current = index;
  };
  
  const handleDragEnd = () => {
    if (draggedIndex !== null && dragOverItem.current !== null && draggedIndex !== dragOverItem.current) {
        const newImages = [...images];
        const draggedItem = newImages.splice(draggedIndex, 1)[0];
        newImages.splice(dragOverItem.current, 0, draggedItem);
        setImages(newImages);
    }
    setDraggedIndex(null);
    dragOverItem.current = null;
  };

  const removeImage = (id: string) => {
    setImages(images.filter(image => image.id !== id));
  };
  
  if (images.length === 0) {
      return null;
  }

  return (
    <div className="space-y-2 mb-4">
        <p className="text-sm font-medium text-light-fg dark:text-dark-fg">Image Order (Drag to reorder)</p>
        <div className="grid grid-cols-3 gap-2">
      {images.map((image, index) => (
        <div
          key={image.id}
          draggable
          onDragStart={() => handleDragStart(index)}
          onDragEnter={() => handleDragEnter(index)}
          onDragEnd={handleDragEnd}
          onDragOver={(e) => e.preventDefault()}
          className={`relative aspect-square rounded-md overflow-hidden cursor-grab transition-opacity ${draggedIndex === index ? 'opacity-50' : 'opacity-100'}`}
        >
          <img src={image.src} alt={`upload-${index}`} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            <span className="text-white font-bold text-2xl">{index + 1}</span>
          </div>
          <button
            onClick={() => removeImage(image.id)}
            className="absolute top-1 right-1 p-0.5 bg-black/50 rounded-full text-white hover:bg-red-500 transition-colors"
            aria-label="Remove image"
          >
            <XIcon className="w-4 h-4" />
          </button>
        </div>
      ))}
      </div>
    </div>
  );
};

export default ImageList;
