import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

// Convex query hooks for House of Quants
// These will return undefined until Convex tables are populated
// Components fall back to mock data from constants.ts

export const useAgents = () => {
  try {
    return useQuery(api.hoq.getAgents) ?? null;
  } catch {
    return null;
  }
};

export const useSignals = () => {
  try {
    return useQuery(api.hoq.getSignals) ?? null;
  } catch {
    return null;
  }
};

export const useCapital = () => {
  try {
    return useQuery(api.hoq.getCapital) ?? null;
  } catch {
    return null;
  }
};

export const usePositions = () => {
  try {
    return useQuery(api.hoq.getPositions) ?? null;
  } catch {
    return null;
  }
};
