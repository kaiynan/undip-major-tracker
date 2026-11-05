// =============================================================================
// UNDIP Major Matcher — Konfigurasi Algoritma
// =============================================================================
// Konfigurasi bobot dimensi dan ambang batas tier untuk algoritma pencocokan.
// =============================================================================

import { AlgorithmConfig } from './types';

export const algorithmConfig: AlgorithmConfig = {
  version: '1.0.0',
  weights: {
    riasec: 0.20,
    domain: 0.35,
    learning: 0.20,
    curriculum: 0.25,
  },
  tierThresholds: [
    {
      tier: 'S',
      min: 85,
      max: 100,
      label: 'Sangat Sesuai',
      color: '#FFD700',
      bgColor: '#FFF8E1',
    },
    {
      tier: 'A',
      min: 75,
      max: 84,
      label: 'Sesuai',
      color: '#4CAF50',
      bgColor: '#E8F5E9',
    },
    {
      tier: 'B',
      min: 65,
      max: 74,
      label: 'Cukup Sesuai',
      color: '#2196F3',
      bgColor: '#E3F2FD',
    },
    {
      tier: 'C',
      min: 50,
      max: 64,
      label: 'Kurang Sesuai',
      color: '#FF9800',
      bgColor: '#FFF3E0',
    },
    {
      tier: 'D',
      min: 0,
      max: 49,
      label: 'Tidak Sesuai',
      color: '#9E9E9E',
      bgColor: '#F5F5F5',
    },
  ],
};
