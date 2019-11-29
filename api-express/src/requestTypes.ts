import { User } from "./types";
export interface AuthorizedRequest {
  user: User;
}

export interface GetContractParams {
  id: string;
};

export interface GetContractRequest extends AuthorizedRequest {
  params: GetContractParams;
}

export interface RequestContractBody {
  amount: number;
  paybackDate: string;
  purpose: string;
}

export interface RequestContractRequest extends AuthorizedRequest {
  body: RequestContractBody
}