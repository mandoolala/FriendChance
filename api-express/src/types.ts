
type UserId = string;

export interface User {
  id: UserId;
  name: string;
}

export interface PromissoryNoteContent {
  id: string;
  amount: number;
  purpose: string;
  createdAt: string;
  contractDate: string;
  paybackDate: string;
  state: 'draft' | 'requestedConfirm' | 'pendingActivation' | 'activated' | 'ended';
}

export interface PromissoryNoteRecord extends PromissoryNoteContent {
  id: string;
  amount: number;
  purpose: string;
  createdAt: string;
  contractDate: string;
  paybackDate: string;
  borrowerId: UserId;
  lenderId: UserId;
  state: 'draft' | 'requestedConfirm' | 'pendingActivation' | 'activated' | 'ended';
}

export interface PromissoryNoteResponse extends PromissoryNoteContent {
  lender: User;
  borrower: User;
}

