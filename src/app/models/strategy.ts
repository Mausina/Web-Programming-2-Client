// mirrors the Strategy entity returned by the Express API
export interface Strategy {
  _id: string;
  name: string;
  isActive: boolean;
  buyAmountSol: number;
  takeProfitPct: number;
  stopLossPct: number;
  maxHoldMinutes: number;
  isPublic: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// the shape we send to the API when creating or updating a strategy
export interface StrategyInput {
  name: string;
  isActive?: boolean;
  buyAmountSol: number;
  takeProfitPct: number;
  stopLossPct: number;
  maxHoldMinutes: number;
  isPublic?: boolean;
}
