import { User, PromissoryNoteRecord, PromissoryNoteResponse, PromissoryNoteDraftContent } from "./types";
import { AuthorizedRequest, GetNoteRequest, RequestNoteRequest, RequestNoteBody } from "./requestTypes";

const express = require('express')
const morgan = require('morgan')
const cors = require('cors');
const bodyParser = require('body-parser')

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

let nextNoteId = 2;
const getNextId = () => {
  nextNoteId++;
  return String(nextNoteId - 1);
}
const notes: PromissoryNoteRecord[] = [
  {
    id: "0",
    purpose: "서울에서 전세 구하기",
    amount: 9000000,
    createdAt: new Date().toISOString(),
    contractDate: "",
    paybackDate: "",
    borrowerId: "123",
    lenderId: "",
    state: "draft",
  },
  {
    id: "1",
    purpose: "급한 소액대출 불끄기",
    amount: 1000000,
    createdAt: new Date().toISOString(),
    contractDate: "",
    paybackDate: "",
    borrowerId: "123",
    lenderId: "999",
    state: "activated",
  },
  ...[...Array(10)].map((_, index) => (
      {
        id: String(index + 10),
        purpose: "급한 소액대출 불끄기",
        amount: 1000000,
        createdAt: new Date().toISOString(),
        contractDate: "",
        paybackDate: "",
        borrowerId: "123",
        lenderId: "999",
        state: "activated" as const,
      }
  ))
];

const findUserById = (id: string) => {
  return userById[id];
}

const findNotesOfUser = (userId: string) => {
  return notes.filter(({ borrowerId, lenderId }) => borrowerId === userId || lenderId === userId);
}

const createDraftNote = (userId: string, data: RequestNoteBody) => {
  const note: PromissoryNoteRecord = {
    ...data,
    id: getNextId(),
    createdAt: new Date().toISOString(),
    contractDate: "",
    borrowerId: userId,
    lenderId: "",
    state: "draft"
  };
  notes.push(note);
  return note;
}

const requestConfirm = (noteId: string) => {
  findNoteById(noteId).state = "requestedConfirm";
};

const findNoteById = (id: string) => {
  return notes.find(note => note.id === id);
}

const enrichNote: (note: PromissoryNoteRecord) => PromissoryNoteResponse = (note) => (
  { ...note, borrower: findUserById(note.borrowerId), lender: findUserById(note.lenderId) }
)

app.use(cors())
app.use(morgan('dev'))
app.use(bodyParser.json());
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

app.post('/notes', (req: RequestNoteRequest, res) => {
  const draftNote = createDraftNote(req.user.id, req.body);
  requestConfirm(draftNote.id);
  res.status(200).json(draftNote);
})

app.post('/notes/:id/confirm', (req, res) => {

});

app.post('/notes/:id/reject', (req, res) => {

});

app.listen(8080, () => {
  console.log('Server started at port 8080')
})
