
import React, { createContext, useState, ReactNode } from 'react';

interface SystemStatusContextType {
  isMaintenanceMode: boolean;
  setMaintenanceMode: (isMaintenance: boolean) => void;
}

export const SystemStatusContext = createContext<SystemStatusContextType | undefined>(undefined);

export const SystemStatusProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isMaintenanceMode, setMaintenanceMode] = useState(false);

  return (
    <SystemStatusContext.Provider value={{ isMaintenanceMode, setMaintenanceMode }}>
      {children}
    </SystemStatusContext.Provider>
  );
};
