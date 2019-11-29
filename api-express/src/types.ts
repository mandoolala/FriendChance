
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
}

export type PromissoryNoteResponse = 
  PromissoryNoteDraftContent 
  | PromissoryNoteRequestedConfirmContent 
  | PromissoryNotePendingActivationContent 
  | PromissoryNoteEndedContent 
  | PromissoryNoteActivatedContent;

export interface PromissoryNoteDraftContent extends PromissoryNoteContent {
  state: 'draft';
  borrower: User;
}

export interface PromissoryNoteRequestedConfirmContent extends PromissoryNoteContent {
  state: 'requestedConfirm';
  borrower: User;
}


export interface PromissoryNotePendingActivationContent extends PromissoryNoteContent {
  state: 'pendingActivation';
  lender: User;
  borrower: User;
}


export interface PromissoryNoteEndedContent extends PromissoryNoteContent {
  state: 'ended';
  lender: User;
  borrower: User;
}


export interface PromissoryNoteActivatedContent extends PromissoryNoteContent {
  state: 'activated';
  lender: User;
  borrower: User;
}
