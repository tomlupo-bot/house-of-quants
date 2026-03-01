import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

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

export const useTrades = () => {
  try {
    return useQuery(api.hoq.getTrades) ?? null;
  } catch {
    return null;
  }
};

export const useEquity = () => {
  try {
    return useQuery(api.hoq.getEquity) ?? null;
  } catch {
    return null;
  }
};

export const useContent = () => {
  try {
    return useQuery(api.hoq.getContent) ?? null;
  } catch {
    return null;
  }
};

export const useTokenCosts = () => {
  try {
    return useQuery(api.hoq.getTokenCosts) ?? null;
  } catch {
    return null;
  }
};

export const useThoughts = (agentId?: string) => {
  try {
    return useQuery(api.hoq.getThoughts, agentId ? { agentId } : {}) ?? null;
  } catch {
    return null;
  }
};
