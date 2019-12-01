export enum LoanContractType {
  DRAFT = 'draft',
  REQUESTED = 'requested',
  APPROVED = 'approved',
  ACTIVATED = 'activated',
  REPAYED = 'repayed',
}

export interface User {
  id: string;
  name: string;
  score: number;
  grade: string;
}

export interface LoanContractContent {
  id: string;
  amount: number;
  purpose: string;
  createdAt: string;
  contractDate: string;
  paybackDate: string;
  state: LoanContractType;
  borrower: User;
  lender: any;
}
