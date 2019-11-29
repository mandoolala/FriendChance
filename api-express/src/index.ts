const express = require('express')
const morgan = require('morgan')

const app = express()

const userById: Partial<{ [key: string]: User }> = {
  123: {
    id: '123',
    name: 'John'
  }
}

interface User {
  id: string;
  name: string;
}

interface PromissoryNote {
  amount: number;
  purpose: string;
  createdAt: string;
  contractDate: string;
  paybackDate: string;
  borrower: User;
  lender: User;
  state: 'draft' | 'requestedConfirm' | 'pendingActivation' | 'activated' | 'ended';
}

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
})

app.get('/test', (req, res) => {
  res.status(200).send('ok')
})

app.get('/test/:id', (req, res) => {
  res.status(200).send(req.params.id)
})

app.listen(3000, () => {
  console.log('Server started at port 3000')
})
