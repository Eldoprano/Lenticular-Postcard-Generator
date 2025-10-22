
import React, { useState } from 'react';
import Header from './components/Header';
import SettingsPanel from './components/SettingsPanel';
import PreviewPanel from './components/PreviewPanel';
import { LenticularImage, LenticularSettings } from './types';
import { useTheme } from './hooks/useTheme';

function App() {
  const [theme, toggleTheme] = useTheme();
  const [images, setImages] = useState<LenticularImage[]>([]);
  const [settings, setSettings] = useState<LenticularSettings>({
    lpi: 75,
    dpi: 600,
    width: 6,
    height: 4,
  });

  return (
    <div className="flex flex-col h-screen font-sans bg-light-bg dark:bg-dark-bg text-light-fg dark:text-dark-fg">
      <Header theme={theme} toggleTheme={toggleTheme} />
      <main className="flex flex-1 overflow-hidden flex-col lg:flex-row">
        <SettingsPanel
          images={images}
          setImages={setImages}
          settings={settings}
          setSettings={setSettings}
        />
        <PreviewPanel images={images} settings={settings} />
      </main>
    </div>
  );
}

export default App;
