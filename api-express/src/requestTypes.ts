import { User } from "./types";
export interface AuthorizedRequest {
  user: User;
}

export interface GetNoteParams {
  id: string;
};

export interface GetNoteRequest extends AuthorizedRequest {
  params: GetNoteParams;
}

export interface RequestNoteBody {
  amount: number;
  paybackDate: string;
  purpose: string;
}

export interface RequestNoteRequest extends AuthorizedRequest {
  body: RequestNoteBody
}