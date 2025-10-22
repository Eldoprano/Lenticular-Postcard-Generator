
import React from 'react';
import { LenticularImage, LenticularSettings } from '../types';
import LenticularPreview from './LenticularPreview';

interface PreviewPanelProps {
  images: LenticularImage[];
  settings: LenticularSettings;
}

const PreviewPanel: React.FC<PreviewPanelProps> = ({ images, settings }) => {
  return (
    <div className="flex-1 h-full bg-light-bg-alt dark:bg-dark-bg-alt overflow-hidden">
        <div className="w-full h-full flex flex-col items-center justify-center">
             <LenticularPreview images={images} settings={settings} />
        </div>
    </div>
  );
};

export default PreviewPanel;
