var fs = require('fs');


const ganache = require('ganache - cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const truffleAssert = require('truffle-assertions');
const assert = require('assert');

const json = require('./../build/contracts/Contracts.json');

const interface = json['abi'];
const bytecode = json['bytecode'];

bytecode = fs.readFileSync('loanContract_sol.bin').toString();
abi = JSON.parse(fs.readFileSync('loanContract_sol.abi').toString());

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  contracts = await web3.eth.getContracts();

  deployedContracts = await new web3.eth.Contract(interface)
    .deploy({ data: bytecode })
});

describe('loanContract', () => {
  it('deploys a contract', async () => {
    const borrower = await auction.methods.msg.sender.call();
    assert.equal(msg.sender, borrower, 'The borrower is the one who launches the smart contract.');
  });

  it(‘auctions the item’, async () => {
    seller = accounts[1];
    await auction.methods.auction(2).send({ from: seller });
    auctionSeller = await auction.methods.seller().call();
    assert.equal(auctionSeller, seller, “The seller is the one who called the auction method.”);
    auctionBid = await auction.methods.latestBid().call();
    assert.equal(auctionBid, web3.utils.toWei(‘2’, ‘ether’), “The latest bid is the argument sent to auction method converted into wei.”);
  });
  it(‘bids the item’, async () => {
    bidder = accounts[2];
    await auction.methods.bid().send({ from: bidder, value: web3.utils.toWei(‘3’, ‘ether’) });
    auctionBid = await auction.methods.latestBid().call();
    assert.equal(auctionBid, web3.utils.toWei(‘3’, ‘ether’), “The latest bid is the payment sent to bid method converted into wei.”);
  });
  it(‘must bid above the latest bid amount’, async () => {
    bidder = accounts[2];
    try {
      await auction.methods.bid().send({ from: bidder, value: web3.utils.toWei(‘1’, ‘ether’) });
      assert(false);
    } catch (err) {
      assert(err);
    }
  });
  it(‘only manager can finish the auction’, async () => {
    nonmanager = accounts[1];
    try {
      await auction.methods.finishAuction().send({ from: nonmanager });
      assert(false);
    } catch (err) {
      assert(err);
    }
  });
  it(‘finishes the auction as manager’, async () => {
    manager = accounts[0];
    await auction.methods.finishAuction().send({ from: manager });
    assert(true);
  });
});
