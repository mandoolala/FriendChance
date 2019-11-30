var fs = require('fs');

//const ganache = require('ganache - cli');
const ganache = require("ganache-core");
const Web3 = require('web3');
//const web3 = new Web3(ganache.provider());
const web3 = new Web3(ganache.provider() || "ws://localhost:8546");

//const truffleAssert = require('truffle-assertions');
//const assert = require('assert');

const json = require('./../build/contracts/LoanContract.json');

const interface = json['abi'];
const bytecode = json['bytecode'];

bytecode = fs.readFileSync('loanContract.bin').toString();
abi = JSON.parse(fs.readFileSync('loanContract.abi').toString());

beforeEach(async () => {
  //accounts = await web3.eth.getAccounts();
  contracts = await web3.eth.getContracts();

  deployedContracts = await new web3.eth.Contract(interface)
    .deploy({ data: bytecode })
});

const getContractInstance = (web3) => (LoanContract) => {
  const artifact = artifacts.require(LoanContract)
  const deployedAddress = artifact.networks[artifact.network_id].address
  const instance = new web3.eth.Contract(artifact.abi, deployedAddress)
  return instance
}

// describe('loanContract', () => {
//   it('deploys a contract', async () => {
//     const borrower = await auction.methods.msg.sender.call();
//     assert.equal(msg.sender, borrower, 'The borrower is the one who launches the smart contract.');
//   });
});

module.exports = { getWeb3, getContractInstance }

