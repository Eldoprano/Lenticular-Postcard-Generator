
import React from 'react';
import { LenticularImage, LenticularSettings } from '../types';
import ImageUploader from './ImageUploader';
import ImageList from './ImageList';
import ConfigurationForm from './ConfigurationForm';
import ActionButtons from './ActionButtons';

interface SettingsPanelProps {
  images: LenticularImage[];
  setImages: React.Dispatch<React.SetStateAction<LenticularImage[]>>;
  settings: LenticularSettings;
  setSettings: React.Dispatch<React.SetStateAction<LenticularSettings>>;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ images, setImages, settings, setSettings }) => {
  const handleImagesUpload = (newImages: LenticularImage[]) => {
    setImages(prev => [...prev, ...newImages]);
  };

  return (
    <div className="w-full lg:w-[380px] h-full flex-shrink-0 bg-light-bg dark:bg-dark-bg border-r border-light-border dark:border-dark-border p-6 overflow-y-auto">
      <h2 className="text-2xl font-bold mb-4 text-light-fg dark:text-dark-fg">Settings</h2>
      
      <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-light-fg dark:text-dark-fg">1. Upload Images</h3>
          <ImageUploader onImagesUpload={handleImagesUpload} />
          <ImageList images={images} setImages={setImages} />
      </div>

      <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-light-fg dark:text-dark-fg">2. Configure Print</h3>
          <ConfigurationForm settings={settings} setSettings={setSettings} />
      </div>

      <div>
          <h3 className="text-lg font-semibold mb-3 text-light-fg dark:text-dark-fg">3. Generate</h3>
          <ActionButtons images={images} settings={settings} />
      </div>
    </div>
  );
};

export default SettingsPanel;
