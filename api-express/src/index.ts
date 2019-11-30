import { User, LoanContractRecord, LoanContractResponse, LoanContractState, UserCreditGrade } from "./types";
import { AuthorizedRequest, GetContractRequest, RequestContractRequest, RequestContractBody } from "./requestTypes";
import { web3 } from "../web3-config.js";

const express = require('express')
const morgan = require('morgan')
const cors = require('cors');
const bodyParser = require('body-parser')

const app = express();

const userById: Partial<{ [key: string]: User }> = {
  "123": {
    id: '123',
    name: '김삿갓',
    score: 100,
    grade: UserCreditGrade.Normal
  },
  "000": {
    id: '000',
    name: 'Jill',
    score: 0,
    grade: UserCreditGrade.Danger
  },
  "999": {
    id: '999',
    name: '김첨지',
    score: 900,
    grade: UserCreditGrade.Safe
  }
}

let nextContractId = 200;
const getNextId = () => {
  nextContractId++;
  return String(nextContractId - 1);
}
const getDate = (afterDay: number) => {
  return new Date(new Date().getTime() + afterDay * 24 * 3600 * 1000).toISOString();
}
const contracts: LoanContractRecord[] = [
  // {
  //   id: "0",
  //   purpose: "서울에서 전세 구하기",
  //   amount: 9000000,
  //   createdAt: getDate(0),
  //   contractDate: "",
  //   paybackDate: "",
  //   borrowerId: "123",
  //   lenderId: "",
  //   state: LoanContractState.Draft,
  // },
  // {
  //   id: "1",
  //   purpose: "급한 소액대출 불끄기",
  //   amount: 1000000,
  //   createdAt: getDate(1),
  //   contractDate: "",
  //   paybackDate: "",
  //   borrowerId: "999",
  //   lenderId: "123",
  //   state: LoanContractState.Activated,
  // },
  // {
  //   id: "2",
  //   purpose: "집에 가고 싶어서 택시비 빌려줘",
  //   amount: 10000,
  //   createdAt: getDate(2),
  //   contractDate: "",
  //   paybackDate: "",
  //   borrowerId: "999",
  //   lenderId: "123",
  //   state: LoanContractState.Requested,
  // },
  // {
  //   id: "3",
  //   purpose: "부자되게해주세요",
  //   amount: 100000000,
  //   createdAt: getDate(3),
  //   contractDate: "",
  //   paybackDate: "",
  //   borrowerId: "123",
  //   lenderId: "999",
  //   state: LoanContractState.Approved,
  // },
  {
    id: "4",
    purpose: "급한 소액대출 불끄기",
    amount: 1000000,
    createdAt: getDate(-4),
    contractDate: "",
    paybackDate: "2019-12-30",
    borrowerId: "123",
    lenderId: "999",
    state: LoanContractState.Repayed,
  },
  // ...[...Array(10)].map((_, index) => (
  //   {
  //     id: String(index + 10),
  //     purpose: "급한 소액대출 불끄기",
  //     amount: 1000000,
  //     createdAt: getDate(index + 10),
  //     contractDate: "",
  //     paybackDate: "",
  //     borrowerId: "123",
  //     lenderId: "999",
  //     state: LoanContractState.Activated,
  //   }
  // ))
];

const timestamp = (isoDate: string) => new Date(isoDate).getTime();

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
  const result = findContractsOfUser(req.user.id).map(enrichContract);
  result.sort((loanA, loanB) => timestamp(loanB.createdAt) - timestamp(loanA.createdAt));
  res.json(result);
});

app.get('/contracts/:id', (req: GetContractRequest, res) => {
  const contract = findContractById(req.params.id);
  if (contract) {
    res.status(200).json(enrichContract(contract));
  } else {
    res.status(404).send('Not Found');
  }
})

const updateRouter = Router();

updateRouter.use((req, res, next) => {
  next();
  wss.clients.forEach(ws => {
    ws.send("update");
  })
});

updateRouter.post('/contracts', (req: any, res) => {
  const draftContract = createDraftContract(req.user.id, req.body);
  requestApproval(draftContract.id);
  res.status(200).json(draftContract);
})

updateRouter.post('/contracts/:id/approve', (req: any, res) => {
  const contractId = req.params.id;
  const userId = req.user.id;
  const contract = findContractById(contractId);
  if (contract.state !== LoanContractState.Requested) {
    res.status(400).send("Loan not requested");
  } else if (contract.borrowerId === userId) {
    res.status(400).send("You cannot lend money to yourself");
  } else {
    contract.state = LoanContractState.Approved;
    contract.lenderId = userId;
    res.status(200).json(contract);
  }

});

updateRouter.post('/contracts/:id/reject', (req: any, res) => {
  const contractId = req.params.id;
  const userId = req.user.id;
  const contract = findContractById(contractId);
  if (contract.state !== LoanContractState.Requested) {
    res.status(400).send("Loan not requested");
  } else if (contract.borrowerId === userId) {
    res.status(400).send("You cannot lend money to yourself");
  } else {
    contract.state = LoanContractState.Draft;
    res.status(200).json(contract);
  }
});

updateRouter.post('/contracts/:id/activate', (req: any, res) => {
  const contractId = req.params.id;
  const userId = req.user.id;
  const contract = findContractById(contractId);
  if (contract.state !== LoanContractState.Approved) {
    res.status(400).send("Loan not approved");
  } else if (contract.lenderId !== userId) {
    res.status(400).send("You cannot lend money to this loan");
  } else {
    // TODO:: Validating the transaction?
    contract.state = LoanContractState.Activated;
    res.status(200).json(contract);
  }
});

updateRouter.post('/contracts/:id/repay', (req: any, res) => {
  const contractId = req.params.id;
  const userId = req.user.id;
  const contract = findContractById(contractId);
  if (contract.state !== LoanContractState.Activated) {
    res.status(400).send("Loan not activated");
  } else if (contract.borrowerId !== userId) {
    res.status(400).send("You don't own this loan");
  } else {
    // TODO:: Validating the transaction?
    contract.state = LoanContractState.Repayed;
    res.status(200).json(contract);
  }

});

app.use(updateRouter);

const WebSocket = require('ws');

const WS_PORT = Number(process.env.WS_PORT) || 7070;
const wss = new WebSocket.Server({
  port: WS_PORT,
  perMessageDeflate: {
    zlibDeflateOptions: {
      // See zlib defaults.
      chunkSize: 1024,
      memLevel: 7,
      level: 3
    },
    zlibInflateOptions: {
      chunkSize: 10 * 1024
    },
    // Other options settable:
    clientNoContextTakeover: true, // Defaults to negotiated value.
    serverNoContextTakeover: true, // Defaults to negotiated value.
    serverMaxWindowBits: 10, // Defaults to negotiated value.
    // Below options specified as default values.
    concurrencyLimit: 10, // Limits zlib concurrency for perf.
    threshold: 1024 // Size (in bytes) below which messages
    // should not be compressed.
  }
});

const PORT = Number(process.env.PORT) || 8080;

app.listen(PORT, () => {
  console.log('Server started at port ' + PORT);
})
