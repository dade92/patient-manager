import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Patient } from '../types/patient';
import { Operation } from '../types/operation';

interface CacheContextType {
  cachedPatients: Record<string, Patient>;
  setCachedPatient: (patientId: string, patient: Patient) => void;
  getCachedPatient: (patientId: string) => Patient | undefined;

  cachedOperationsByPatient: Record<string, Operation[]>;
  setCachedOperationsForPatient: (patientId: string, operations: Operation[]) => void;
  getCachedOperationsForPatient: (patientId: string) => Operation[] | undefined;

  cachedOperations: Record<string, Operation>;
  setCachedOperation: (operationId: string, operation: Operation) => void;
  getCachedOperation: (operationId: string) => Operation | undefined;
}

const CacheContext = createContext<CacheContextType | undefined>(undefined);

export const CacheProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cachedPatients, setCachedPatients] = useState<Record<string, Patient>>({});
  const [cachedOperationsByPatient, setCachedOperationsByPatient] = useState<Record<string, Operation[]>>({});
  const [cachedOperations, setCachedOperations] = useState<Record<string, Operation>>({});

  const setCachedPatient = (patientId: string, patient: Patient) => {
    setCachedPatients(prev => ({
      ...prev,
      [patientId]: patient
    }));
  };

  const getCachedPatient = (patientId: string) => {
    return cachedPatients[patientId];
  };

  const setCachedOperationsForPatient = (patientId: string, operations: Operation[]) => {
    setCachedOperationsByPatient(prev => ({
      ...prev,
      [patientId]: operations
    }));

    operations.forEach(operation => {
      setCachedOperation(operation.id, operation);
    });
  };

  const getCachedOperationsForPatient = (patientId: string) => {
    return cachedOperationsByPatient[patientId];
  };

  const setCachedOperation = (operationId: string, operation: Operation) => {
    setCachedOperations(prev => ({
      ...prev,
      [operationId]: operation
    }));
  };

  const getCachedOperation = (operationId: string) => {
    return cachedOperations[operationId];
  };

  return (
    <CacheContext.Provider value={{
      cachedPatients,
      setCachedPatient,
      getCachedPatient,
      cachedOperationsByPatient,
      setCachedOperationsForPatient,
      getCachedOperationsForPatient,
      cachedOperations,
      setCachedOperation,
      getCachedOperation
    }}>
      {children}
    </CacheContext.Provider>
  );
};

export const useCache = () => {
  const context = useContext(CacheContext);
  if (context === undefined) {
    throw new Error('useCache must be used within a CacheProvider');
  }
  return context;
};
