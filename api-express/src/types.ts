
type UserId = string;
export enum LoanContractState {
  Draft = 'draft',
  Requested = 'requested',
  Approved = 'approved',
  Activated = 'activated',
  Repayed = 'repayed',
}

export interface User {
  id: UserId;
  name: string;
}

export interface LoanContractContent {
  id: string;
  amount: number;
  purpose: string;
  createdAt: string;
  contractDate: string;
  paybackDate: string;
  state: LoanContractState;
}

export interface LoanContractRecord extends LoanContractContent {
  id: string;
  amount: number;
  purpose: string;
  createdAt: string;
  contractDate: string;
  paybackDate: string;
  borrowerId: UserId;
  lenderId: UserId;
}

export type LoanContractResponse =
  LoanContractDraftContent
  | LoanContractRequestedContent
  | LoanContractApprovedContent
  | LoanContractActivatedContent
  | LoanContractRepayedContent;

export interface LoanContractDraftContent extends LoanContractContent {
  state: LoanContractState.Draft;
  borrower: User;
}

export interface LoanContractRequestedContent extends LoanContractContent {
  state: LoanContractState.Requested;
  borrower: User;
}

export interface LoanContractApprovedContent extends LoanContractContent {
  state: LoanContractState.Approved;
  lender: User;
  borrower: User;
}

export interface LoanContractActivatedContent extends LoanContractContent {
  state: LoanContractState.Activated;
  lender: User;
  borrower: User;
}
export interface LoanContractRepayedContent extends LoanContractContent {
  state: LoanContractState.Repayed;
  lender: User;
  borrower: User;
}
