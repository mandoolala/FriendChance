import { User } from "./types";
export interface AuthorizedRequest {
  user: User;
}
export interface GetNoteRequest extends AuthorizedRequest {
  params: {
    id: string;
  };
}
