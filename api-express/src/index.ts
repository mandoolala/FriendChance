const express = require('express')
const morgan = require('morgan')
const cors = require('cors');

const app = express()

const userById: Partial<{ [key: string]: User }> = {
  123: {
    id: '123',
    name: 'John'
  }
}

const nextNoteId = 1;
const notes: PromissoryNote[] = [];

const findNoteById = (id: string) => {
  return notes.find(note => note.id === id);
}

interface User {
  id: string;
  name: string;
}

interface PromissoryNote {
  id: string;
  amount: number;
  purpose: string;
  createdAt: string;
  contractDate: string;
  paybackDate: string;
  borrower: User;
  lender: User;
  state: 'draft' | 'requestedConfirm' | 'pendingActivation' | 'activated' | 'ended';
}

app.use(cors())
app.use(morgan('dev'))
app.use((req, res, next) => {
  const id = req.headers.authorization;
  const user = userById[id];
  if (user) {
    req.user = user;
    next()
    return
  }
  res.status(401).send('Unauthorized')
})

app.get('/user', (req, res) => {
  res.json(req.user)
});

app.get('/notes', (req, res) => {
  res.json(notes);
});

app.get('/notes/:id', (req, res) => {
  const note = findNoteById(req.params.id);
  if (note) {
    res.status(200).json(note);
  } else {
    res.status(404).send('Not Found');
  }
})

app.listen(8080, () => {
  console.log('Server started at port 8080')
})
