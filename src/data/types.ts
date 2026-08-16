export interface Coordinates {
  latitude: number;
  longitude: number;
}

export type POIType = 'hometown' | 'education' | 'work' | 'project' | 'hobby' | 'landmark';

export interface VisualSpec {
  building: 'home' | 'school' | 'university' | 'office' | 'lab' | 'arcade' | 'park' | 'tower' | 'studio';
  scale?: number;
  color?: string;
  roofColor?: string;
  sign?: string;
  icon?: string;
}

export interface POIProject {
  title: string;
  description: string;
  technologies?: string[];
  link?: string;
}

export interface POILink {
  label: string;
  url: string;
}

export interface POIContent {
  period?: string;
  role?: string;
  summary: string;
  skills?: string[];
  projects?: POIProject[];
  achievements?: string[];
  links?: POILink[];
  images?: string[];
  customFields?: Record<string, string | string[]>;
}

export interface POI {
  id: string;
  type: POIType;
  title: string;
  coordinates: Coordinates;
  visual: VisualSpec;
  content: POIContent;
}

export interface WorldConfig {
  planetRadius: number;
  density: number;
  minimumPOIDistance: number;
  roadDensity: number;
  decorationDensity: number;
  dayLengthSeconds: number;
  seasonLengthSeconds: number;
}

export interface WorldData {
  config: WorldConfig;
  pois: POI[];
}
