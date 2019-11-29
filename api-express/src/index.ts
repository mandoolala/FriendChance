import { User, LoanContractRecord, LoanContractResponse, LoanContractState } from "./types";
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

let nextContractId = 200;
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
    state: LoanContractState.Draft,
  },
  {
    id: "1",
    purpose: "급한 소액대출 불끄기",
    amount: 1000000,
    createdAt: new Date().toISOString(),
    contractDate: "",
    paybackDate: "",
    borrowerId: "999",
    lenderId: "123",
    state: LoanContractState.Activated,
  },
  {
    id: "2",
    purpose: "집에 가고 싶어서 택시비 빌려줘",
    amount: 10000,
    createdAt: new Date().toISOString(),
    contractDate: "",
    paybackDate: "",
    borrowerId: "999",
    lenderId: "123",
    state: LoanContractState.Requested,
  },
  {
    id: "3",
    purpose: "부자되게해주세요",
    amount: 100000000,
    createdAt: new Date().toISOString(),
    contractDate: "",
    paybackDate: "",
    borrowerId: "123",
    lenderId: "999",
    state: LoanContractState.Approved,
  },
  {
    id: "4",
    purpose: "멕시코 타코 살사 소스",
    amount: 1000000,
    createdAt: new Date().toISOString(),
    contractDate: "",
    paybackDate: "",
    borrowerId: "123",
    lenderId: "999",
    state: LoanContractState.Repayed,
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
      state: LoanContractState.Activated,
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
    state: LoanContractState.Draft
  };
  contracts.push(contract);
  return contract;
}

const requestApproval = (contractId: string) => {
  findContractById(contractId).state = LoanContractState.Requested;
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

app.post('/contracts/:id/approve', (req, res) => {
  const contractId = req.params.id;
  const userId = req.user.id;
  const contract = findContractById(contractId);
  if (contract.state !== LoanContractState.Requested || contract.borrowerId === userId) {
    res.status(404).send("Unauthorized");
    return;
  }
  contract.state = LoanContractState.Approved;
  res.status(200).json(contract);
});

app.post('/contracts/:id/reject', (req, res) => {
  const contractId = req.params.id;
  const userId = req.user.id;
  const contract = findContractById(contractId);
  if (contract.state !== LoanContractState.Requested || contract.borrowerId === userId) {
    res.status(404).send("Not Found");
    return;
  }
  contract.state = LoanContractState.Draft;
  res.status(200).json(contract);
});

app.post('/contracts/:id/activate', (req, res) => {
  const contractId = req.params.id;
  const userId = req.user.id;
  const contract = findContractById(contractId);
  if (contract.state !== LoanContractState.Approved || contract.lenderId !== userId) {
    res.status(404).send("Not Found");
    return;
  }
  // TODO:: Validating the transaction?
  contract.state = LoanContractState.Activated;
  res.status(200).json(contract);
});

app.post('/contracts/:id/repay', (req, res) => {
  const contractId = req.params.id;
  const userId = req.user.id;
  const contract = findContractById(contractId);
  if (contract.state !== LoanContractState.Activated || contract.borrowerId !== userId) {
    res.status(404).send("Not Found");
    return;
  }
  // TODO:: Validating the transaction?
  contract.state = LoanContractState.Repayed;
  res.status(200).json(contract);
});

const PORT = Number(process.env.PORT) || 8080;

app.listen(PORT, () => {
  console.log('Server started at port ' + PORT);
})
