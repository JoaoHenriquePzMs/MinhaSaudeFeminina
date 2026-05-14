import { useState } from 'react';
import { HealthContent } from '../data/types';
import { MOCK_HEALTH_CONTENT } from '../data/mockData';

// Requisitos: 6.8, 6.9
export const useHealthContent = () => {
  const [contentData] = useState<HealthContent>(MOCK_HEALTH_CONTENT);
  const [isLoading] = useState(false);
  const [hasError] = useState(false);
  const retry = () => {};
  return { contentData, isLoading, hasError, retry };
};
