const LoanContract = artifacts.require("LoanContract");

// New Loan from acc4
CrowdBank.deployed().then(function (inst) { inst.newLoan(web3.toWei(10, 'ether'), 1510584555, "9e4fefb090c5e3726c02f82c0c43fc6d", { from: web3.eth.accounts[4] }); })
// New Proposal from 3 => 4
CrowdBank.deployed().then(function (inst) { inst.newProposal(0, 10, { value: web3.toWei(10, 'ether'), from: web3.eth.accounts[3] }); })
//Revoke Proposal 3 => 4
CrowdBank.deployed().then(function (inst) { inst.revokeProposal(0, { from: web3.eth.accounts[3] }); })
//check balance 3
web3.eth.getBalance(web3.eth.accounts[3]).valueOf() / (10 ** 18)
// Lendmap from a person 0
CrowdBank.deployed().then(function (inst) { inst.lendMap(web3.eth.accounts[0], 1).then(console.log); })

contract("LoanContract", loanContract => {

  beforeEach(async () => {
    borrower = accounts[0];
    lender = accounts[1];
    managementContract = accounts[2];
    other = accounts[9];

    lendingRequest = await LendingRequest.new(
      asker,
      true,
      web3.utils.toWei("1", "ether"),
      web3.utils.toWei("2", "ether"),
      web3.utils.toWei("1", "ether"),
      "food",
      managementContract,
      TrustToken.address
    );
  });
});