const LoanContracts = artifacts.require("LoanContracts");

module.exports = function (deployer) {
  deployer.deploy(LoanContracts);
};