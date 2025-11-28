import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import type { ReactNode } from 'react';
import { useAuth } from './AuthProvider';
import { getFeatureFlags } from '../services/api';

type FeatureFlagContextType = {
  flags: string[];
  isFeatureEnabled: (flagName: string) => boolean;
  isLoading: boolean;
};

const FeatureFlagContext = createContext<FeatureFlagContextType | undefined>(undefined);

type FeatureFlagProviderProps = {
  children: ReactNode;
};

export const FeatureFlagProvider: React.FC<FeatureFlagProviderProps> = ({ children }) => {
  const { token, user, loading: isAuthLoading } = useAuth();
  const isAuthenticated = !!user;
  const [flags, setFlags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthLoading) {
      if (isAuthenticated && token) {
        setIsLoading(true);
        getFeatureFlags(token)
          .then(setFlags)
          .catch((error) => {
            console.error('Failed to fetch feature flags:', error);
            setFlags([]);
          })
          .finally(() => {
            setIsLoading(false);
          });
      } else {
        setFlags([]);
        setIsLoading(false);
      }
    }
  }, [isAuthenticated, token, isAuthLoading]);

  const isFeatureEnabled = useMemo(() => (flagName: string) => flags.includes(flagName), [flags]);

  const value = useMemo(() => ({ flags, isFeatureEnabled, isLoading }), [flags, isFeatureEnabled, isLoading]);

  return (
    <FeatureFlagContext.Provider value={value}>
      {children}
    </FeatureFlagContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useFeatureFlag = (flagName: string): boolean => {
  const context = useContext(FeatureFlagContext);
  if (context === undefined) {
    throw new Error('useFeatureFlag must be used within a FeatureFlagProvider');
  }
  return context.isFeatureEnabled(flagName);
};

// eslint-disable-next-line react-refresh/only-export-components
export const useFeatureFlags = () => {
  const context = useContext(FeatureFlagContext);
  if (context === undefined) {
    throw new Error('useFeatureFlags must be used within a FeatureFlagProvider');
  }
  return { flags: context.flags, isFeatureEnabled: context.isFeatureEnabled, isLoading: context.isLoading };
};
