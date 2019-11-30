var fs = require('fs');

//const ganache = require('ganache - cli');
const ganache = require("ganache-core");
const Web3 = require('web3');
//const web3 = new Web3(ganache.provider());
const web3 = new Web3(ganache.provider() || "ws://localhost:7545");


//const truffleAssert = require('truffle-assertions');
//const assert = require('assert');

const json = require('./../build/contracts/LoanContract.json');
const artifact = artifacts.require(LoanContract);


const interface = json['abi'];
const bytecode = json['bytecode'];
bytecode = fs.readFileSync('loanContract.bin').toString();
abi = JSON.parse(fs.readFileSync('loanContract.abi').toString());

deployContract();

function deployContract() {
  console.log(web3.eth.accounts);
  web3.eth.defaultAccount = web3.eth.accounts[0];
  var loanContract = new web3.eth.contract(abi, web3.eth.defaultAccount);
};

function createContract() {
  loanContract.new({
    data: bytecode,
    from: web3.eth.defaultAccount
  });
}

const getContractInstance = (web3) => (LoanContract) => {
  const artifact = artifacts.require(LoanContract)
  const deployedAddress = artifact.networks[artifact.network_id].address
  const instance = new web3.eth.Contract(artifact.abi, deployedAddress)
  return instance
}

module.exports = { web3, getContractInstance }



//tests
// describe('loanContract', () => {
//   it('deploys a contract', async () => {
//     const borrower = await auction.methods.msg.sender.call();
//     assert.equal(msg.sender, borrower, 'The borrower is the one who launches the smart contract.');
//   });
// });


