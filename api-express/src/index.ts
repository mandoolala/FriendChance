import { User, PromissoryNoteRecord, PromissoryNoteResponse } from "./types";
import { AuthorizedRequest, GetNoteRequest } from "./requestTypes";

const express = require('express')
const morgan = require('morgan')
const cors = require('cors');

const app = express();

const userById: Partial<{ [key: string]: User }> = {
  "123": {
    id: '123',
    name: 'John'
  },
  "000": {
    id: '000',
    name: 'Jill'
  },
  "999": {
    id: '999',
    name: '김정은'
  }
}

const nextNoteId = 1;
const notes: PromissoryNoteRecord[] = [
  {
    id: "0",
    purpose: "서울에서 전세 구하기",
    amount: 90000,
    createdAt: new Date().toISOString(),
    contractDate: "",
    paybackDate: "",
    borrowerId: "123",
    lenderId: "",
    state: "draft",
  }
];

const findUserById = (id: string) => {
  return userById[id];
}

const findNotesOfUser = (userId: string) => {
  return notes.filter(({ borrowerId, lenderId }) => borrowerId === userId || lenderId === userId);
}

const findNoteById = (id: string) => {
  return notes.find(note => note.id === id);
}

const enrichNote: (note: PromissoryNoteRecord) => PromissoryNoteResponse = (note) => (
  { ...note, borrower: findUserById(note.borrowerId), lender: findUserById(note.lenderId) }
)

app.use(cors())
app.use(morgan('dev'))
app.use((req, res, next) => {
  const id = req.headers.authorization;
  const user = findUserById(id);
  if (user) {
    req.user = user;
    next()
    return
  }
  res.status(401).send('Unauthorized')
})

app.get('/user', (req: AuthorizedRequest, res) => {
  res.json(req.user)
});

app.get('/notes', (req: AuthorizedRequest, res) => {
  res.json(findNotesOfUser(req.user.id).map(enrichNote));
});

app.get('/notes/:id', (req: GetNoteRequest, res) => {
  const note = findNoteById(req.params.id);
  if (note) {
    res.status(200).json(enrichNote(note));
  } else {
    res.status(404).send('Not Found');
  }
})

app.listen(8080, () => {
  console.log('Server started at port 8080')
})
