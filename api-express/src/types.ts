
type UserId = string;

type Draft = 'draft';
type Requested = 'requested';
type Approved = 'approved';
type Activated = 'activated';
type Repayed = 'repayed';

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
  state: Draft | Requested | Approved | Activated | Repayed;
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
  state: 'draft';
  borrower: User;
}

export interface LoanContractRequestedContent extends LoanContractContent {
  state: 'requested';
  borrower: User;
}

export interface LoanContractApprovedContent extends LoanContractContent {
  state: 'approved';
  lender: User;
  borrower: User;
}

export interface LoanContractActivatedContent extends LoanContractContent {
  state: 'activated';
  lender: User;
  borrower: User;
}
export interface LoanContractRepayedContent extends LoanContractContent {
  state: 'repayed';
  lender: User;
  borrower: User;
}
