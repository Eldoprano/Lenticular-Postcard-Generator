
export interface LenticularImage {
  id: string;
  src: string;
  file: File;
}

export interface LenticularSettings {
  lpi: number;
  dpi: number;
  width: number; // in inches
  height: number; // in inches
}

export type Theme = 'light' | 'dark';
