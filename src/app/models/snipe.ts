// a snipe references the strategy it belongs to. When the API returns a snipe
// it populates that reference with the strategy's id and name.
export interface StrategyRef {
  _id: string;
  name: string;
}

// mirrors the Snipe entity returned by the Express API (strategy is populated)
export interface Snipe {
  _id: string;
  strategy: StrategyRef;
  tokenName: string;
  tokenMint: string;
  amountSol: number;
  status: 'open' | 'closed';
  profitLossPct: number;
  createdAt?: string;
  updatedAt?: string;
}

// the shape we send to the API when creating or updating a snipe
// (strategy is just the id string here)
export interface SnipeInput {
  strategy: string;
  tokenName: string;
  tokenMint: string;
  amountSol: number;
  status?: 'open' | 'closed';
  profitLossPct?: number;
}
