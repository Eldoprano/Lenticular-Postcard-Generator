
import React, { useCallback, useState } from 'react';
import { LenticularImage } from '../types';
import { UploadIcon } from './icons';

interface ImageUploaderProps {
  onImagesUpload: (images: LenticularImage[]) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImagesUpload }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (files: FileList | null) => {
    if (!files) return;

    const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
    const newImages: LenticularImage[] = imageFiles.map(file => ({
      id: `${file.name}-${Date.now()}`,
      src: URL.createObjectURL(file),
      file: file,
    }));
    
    if(newImages.length > 0) {
      onImagesUpload(newImages);
    }
  };

  const onDragEnter = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);
  
  const onDragOver = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const onDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files);
  }, []);

  return (
    <div className="mb-4">
      <label
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
        className={`flex flex-col items-center justify-center w-full h-32 px-4 transition bg-light-bg-alt dark:bg-dark-bg-alt border-2 border-light-border dark:border-dark-border border-dashed rounded-lg cursor-pointer hover:bg-light-bg-hover dark:hover:bg-dark-bg-hover ${isDragging ? 'border-light-primary dark:border-dark-primary' : ''}`}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <UploadIcon className="w-8 h-8 mb-3 text-light-secondary dark:text-dark-secondary" />
          <p className="mb-2 text-sm text-center text-light-fg dark:text-dark-fg">
            <span className="font-semibold text-light-primary dark:text-dark-primary">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-light-fg/70 dark:text-dark-fg/70">PNG, JPG, or WEBP</p>
        </div>
        <input 
            id="dropzone-file" 
            type="file" 
            multiple 
            accept="image/*" 
            className="hidden" 
            onChange={(e) => handleFileChange(e.target.files)}
        />
      </label>
    </div>
  );
};

export default ImageUploader;
