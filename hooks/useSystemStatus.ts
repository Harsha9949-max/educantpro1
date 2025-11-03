
import { useContext } from 'react';
import { SystemStatusContext } from '../contexts/SystemStatusContext';

export const useSystemStatus = () => {
  const context = useContext(SystemStatusContext);
  if (context === undefined) {
    throw new Error('useSystemStatus must be used within a SystemStatusProvider');
  }
  return context;
};
