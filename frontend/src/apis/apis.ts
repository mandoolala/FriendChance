import client from './client'
import { User } from 'Src/types';
import { RequestNoteBody } from 'Src/requestTypes';

export function sampleAPI() {
  return client.get('/index.html')
}

export function getUser() {
  return client.get<User>('/user');
}

export function getNotes() {
  return client.get('/contracts');
}

export function getNote(noteId: string) {
  return client.get('/contracts/' + noteId);
}

export function postNote(body: RequestNoteBody) {
  return client.post('/contracts', body);
}

export function approveContract(contractId: string) {
  return client.post(`/contracts/${contractId}/approve`);
}

export function rejectContract(contractId: string) {
  return client.post(`/contracts/${contractId}/reject`);
}

export function activateContract(contractId: string) {
  return client.post(`/contracts/${contractId}/activate`);
}

export function repayContract(contractId: string) {
  return client.post(`/contracts/${contractId}/repay`);
}


