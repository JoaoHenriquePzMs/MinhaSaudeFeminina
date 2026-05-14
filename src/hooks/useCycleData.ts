/**
 * useCycleData — Hook de dados do ciclo menstrual
 *
 * Fornece o estado do ciclo menstrual da usuária com valor inicial
 * proveniente dos dados mock, permitindo atualização futura via API.
 *
 * Requisitos: 3.1, 3.2, 3.3
 */

import { useState } from 'react';
import { CycleData } from '../data/types';
import { MOCK_CYCLE_DATA } from '../data/mockData';

export const useCycleData = () => {
  const [cycleData, setCycleData] = useState<CycleData | null>(MOCK_CYCLE_DATA);
  return { cycleData, setCycleData };
};
