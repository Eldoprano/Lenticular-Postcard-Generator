
import React, { useState } from 'react';
import { LenticularImage, LenticularSettings } from '../types';
import { generateInterlacedImage, generateTestSheet } from '../services/lenticularService';
import { DownloadIcon, PrinterIcon } from './icons';

interface ActionButtonsProps {
  images: LenticularImage[];
  settings: LenticularSettings;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ images, settings }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleDownload = async () => {
        if (images.length < 2) {
            setError("Please upload at least two images.");
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const dataUrl = await generateInterlacedImage(images, settings);
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = `lenticular_print_${settings.lpi}lpi.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            console.error("Failed to generate image:", err);
            setError("Failed to generate image. See console for details.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const handlePrintTestSheet = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const dataUrl = await generateTestSheet(settings);
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = `test_sheet_${settings.lpi}lpi_${settings.dpi}dpi.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            console.error("Failed to generate test sheet:", err);
            setError("Failed to generate test sheet. See console for details.");
        } finally {
            setIsLoading(false);
        }
    };

    const Button: React.FC<{ onClick: () => void; disabled: boolean; children: React.ReactNode; primary?: boolean }> = ({ onClick, disabled, children, primary = false}) => (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-md font-semibold transition-colors duration-200
            ${primary 
                ? 'bg-light-primary dark:bg-dark-primary text-white' 
                : 'bg-light-bg-alt dark:bg-dark-bg-alt text-light-fg dark:text-dark-fg border border-light-border dark:border-dark-border'}
            ${disabled
                ? 'opacity-50 cursor-not-allowed'
                : (primary ? 'hover:bg-opacity-90' : 'hover:bg-light-bg-hover dark:hover:bg-dark-bg-hover')}
            `}
        >
            {children}
        </button>
    );

    return (
        <div className="space-y-3">
             {error && <p className="text-sm text-red-500">{error}</p>}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button onClick={handlePrintTestSheet} disabled={isLoading}>
                    <PrinterIcon className="w-5 h-5" />
                    Test Sheet
                </Button>
                <Button onClick={handleDownload} disabled={isLoading || images.length < 2} primary>
                    <DownloadIcon className="w-5 h-5" />
                    {isLoading ? 'Generating...' : 'Download Print'}
                </Button>
            </div>
        </div>
    );
};

export default ActionButtons;
