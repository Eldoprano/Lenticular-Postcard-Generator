
import React from 'react';
import { LenticularSettings } from '../types';

interface ConfigurationFormProps {
  settings: LenticularSettings;
  setSettings: React.Dispatch<React.SetStateAction<LenticularSettings>>;
}

const ConfigurationForm: React.FC<ConfigurationFormProps> = ({ settings, setSettings }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: Number(value) }));
  };

  const InputField: React.FC<{name: keyof LenticularSettings, label: string, unit: string}> = ({name, label, unit}) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-light-fg dark:text-dark-fg">
            {label}
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
            <input
                type="number"
                name={name}
                id={name}
                value={settings[name]}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-light-bg-alt dark:bg-dark-bg-alt border border-light-border dark:border-dark-border rounded-md focus:ring-light-primary dark:focus:ring-dark-primary focus:border-light-primary dark:focus:border-dark-primary"
                min="1"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-light-fg/50 dark:text-dark-fg/50 sm:text-sm">{unit}</span>
            </div>
        </div>
    </div>
  );


  return (
    <div className="space-y-4 mb-6">
      <InputField name="lpi" label="Lenses Per Inch" unit="LPI" />
      <InputField name="dpi" label="Output Resolution" unit="DPI" />
      <div className="grid grid-cols-2 gap-4">
        <InputField name="width" label="Postcard Width" unit="in" />
        <InputField name="height" label="Postcard Height" unit="in" />
      </div>
    </div>
  );
};

export default ConfigurationForm;
