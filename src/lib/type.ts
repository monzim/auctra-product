export interface AuctraBidV2 {
  id: number;
  contractor: string;
  amount: string;
  timestamp: string;
  status: string;
  hash: string;
  publishHash: string;
}
export interface AuctraBid {
  id: number;
  contractor: string;
  amount: string;
  timestamp: string;
  status: string;
  hash: string;
}

export interface AuctraProduct {
  id: number;
  name: string;
  description: string;
  price: string;
  company: string;
  hash: string;
}

export interface AuctraProductV2 {
  id: number;
  name: string;
  description: string;
  price: string;
  company: string;
  hash: string;
  publishHash: string;
}
