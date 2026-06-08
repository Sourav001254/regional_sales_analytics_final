import { useState, useEffect } from 'react';
import { generateDataset, SalesRecord } from '../utils/dataGenerator';

export function useDataset() {
  const [data, setData] = useState<SalesRecord[]>([]);

  useEffect(() => {
    // Generate data on mount
    setData(generateDataset(5000));
  }, []);

  return { data };
}
