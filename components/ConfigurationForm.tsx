import React from 'react';
import { LenticularSettings } from '../types';

interface ConfigurationFormProps {
  settings: LenticularSettings;
  setSettings: React.Dispatch<React.SetStateAction<LenticularSettings>>;
}

const ConfigurationForm: React.FC<ConfigurationFormProps> = ({ settings, setSettings }) => {

  const handleSettingsChange = (name: keyof LenticularSettings, value: number) => {
    if (isNaN(value)) return;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const NumberInputWithControls: React.FC<{
    name: keyof LenticularSettings, 
    label: string, 
    unit: string, 
    step?: number,
    min?: number,
  }> = ({name, label, unit, step = 1, min = 0.01}) => {
    
    const value = settings[name];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleSettingsChange(name, parseFloat(e.target.value));
    };

    const handleStep = (direction: 'up' | 'down') => {
        const precision = String(step).split('.')[1]?.length || 0;
        const newValue = direction === 'up' 
            ? parseFloat((value + step).toFixed(precision))
            : parseFloat(Math.max(min, value - step).toFixed(precision));
        handleSettingsChange(name, newValue);
    };

    return (
      <div>
          <label htmlFor={name} className="block text-sm font-medium text-light-fg dark:text-dark-fg">
              {label}
          </label>
          <div className="mt-1 relative rounded-md">
              <input
                  type="number"
                  name={name}
                  id={name}
                  value={settings[name]}
                  onChange={handleInputChange}
                  className="w-full pl-3 pr-16 py-2 bg-light-bg-alt dark:bg-dark-bg-alt border border-light-border dark:border-dark-border rounded-md focus:ring-light-primary dark:focus:ring-dark-primary focus:border-light-primary dark:focus:border-dark-primary"
                  min={min}
                  step={step}
              />
              <div className="absolute inset-y-0 right-0 pr-10 flex items-center pointer-events-none">
                  <span className="text-light-fg/50 dark:text-dark-fg/50 sm:text-sm">{unit}</span>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center">
                  <div className="flex flex-col items-center justify-center h-full px-2">
                      <button 
                          onClick={() => handleStep('up')} 
                          className="h-1/2 flex items-center justify-center text-light-fg/70 dark:text-dark-fg/70 hover:text-light-fg dark:hover:text-dark-fg"
                          aria-label={`Increase ${label}`}
                        >
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M10 6l-5 5h10l-5-5z"/></svg>
                      </button>
                      <button 
                          onClick={() => handleStep('down')} 
                          className="h-1/2 flex items-center justify-center text-light-fg/70 dark:text-dark-fg/70 hover:text-light-fg dark:hover:text-dark-fg"
                          aria-label={`Decrease ${label}`}
                        >
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M10 14l5-5H5l5 5z"/></svg>
                      </button>
                  </div>
              </div>
          </div>
      </div>
    );
  };


  return (
    <div className="space-y-4 mb-6">
      <NumberInputWithControls name="lpi" label="Lenses Per Inch" unit="LPI" step={0.01} />
      <NumberInputWithControls name="dpi" label="Output Resolution" unit="DPI" />
      <div className="grid grid-cols-2 gap-4">
        <NumberInputWithControls name="width" label="Postcard Width" unit="in" step={0.1} />
        <NumberInputWithControls name="height" label="Postcard Height" unit="in" step={0.1} />
      </div>
    </div>
  );
};

export default ConfigurationForm;