import { User, LoanContractRecord, LoanContractResponse, LoanContractDraftContent } from "./types";
import { AuthorizedRequest, GetContractRequest, RequestContractRequest, RequestContractBody } from "./requestTypes";

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

let nextContractId = 2;
const getNextId = () => {
  nextContractId++;
  return String(nextContractId - 1);
}
const contracts: LoanContractRecord[] = [
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

const findContractsOfUser = (userId: string) => {
  return contracts.filter(({ borrowerId, lenderId }) => borrowerId === userId || lenderId === userId);
}

const createDraftContract = (userId: string, data: RequestContractBody) => {
  const contract: LoanContractRecord = {
    ...data,
    id: getNextId(),
    createdAt: new Date().toISOString(),
    contractDate: "",
    borrowerId: userId,
    lenderId: "",
    state: "draft"
  };
  contracts.push(contract);
  return contract;
}

const requestApproval = (contractId: string) => {
  findContractById(contractId).state = "requested";
};

const findContractById = (id: string) => {
  return contracts.find(contract => contract.id === id);
}

const enrichContract: (contract: LoanContractRecord) => LoanContractResponse = (contract) => (
  { ...contract, borrower: findUserById(contract.borrowerId), lender: findUserById(contract.lenderId) }
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

app.get('/contracts', (req: AuthorizedRequest, res) => {
  res.json(findContractsOfUser(req.user.id).map(enrichContract));
});

app.get('/contracts/:id', (req: GetContractRequest, res) => {
  const contract = findContractById(req.params.id);
  if (contract) {
    res.status(200).json(enrichContract(contract));
  } else {
    res.status(404).send('Not Found');
  }
})

app.post('/contracts', (req: RequestContractRequest, res) => {
  const draftContract = createDraftContract(req.user.id, req.body);
  requestApproval(draftContract.id);
  res.status(200).json(draftContract);
})

app.post('/contracts/:id/confirm', (req, res) => {

});

app.post('/contracts/:id/reject', (req, res) => {

});

app.listen(8080, () => {
  console.log('Server started at port 8080')
})
