pragma solidity >=0.4.22 <0.7.0;
pragma experimental ABIEncoderV2;

contract LoanContract {

  enum personType {Borrower, Lender}
  enum loanStatus {REQUESTED, APPROVED, REJECTED, ACTIVATED, REPAYED}

  struct PersonInfo{
    personType identifier;
    string id;
    string name;
    string identityNumber;
    string homeAddress;
  }

  struct Contract{
    address contractID;
    loanStatus status;

    PersonInfo borrower;
    PersonInfo lender;

    uint256 borrowAmount;
    string purpose;
    string createdAt; //draft 생긴 시점
    string contractDate; //효력이 생기는 시점
    string paybackDate;

    bool borrower_signature;
    bool lender_signature;
  }

  mapping (address => PersonInfo) users;
  mapping (address => mapping(string => Contract)) contracts;
  mapping (address => uint) creditPoints;

  event Register(address, string, string, string);

  event CreateLoan(address, string); //borrower
  event ApproveLoan(address, string); //lender
  event RejectLoan(address, string); //lender
  event DeleteLoan(address, string); //if rejected by lender
  event ActivateLoan(address, string); //borrower when received money
  event ConfirmRepayLoan(address, string); //lender

  function signPersonalInfo(personType _identifier, string memory _name, string memory _identityNumber, string memory _homeAddress) public {

    users[msg.sender].identifier = _identifier;
    users[msg.sender].name = _name;
    users[msg.sender].identityNumber = _identityNumber;
    users[msg.sender].homeAddress = _homeAddress;

    emit Register(msg.sender, _name, _identityNumber, _homeAddress);

  }
  // function getUser(address userKey) public view
  //   returns(LoanContract.personType,string memory,string memory,string memory,uint256) {
  //   return(users[userKey].identifier, users[userKey].name, users[userKey].identityNumber, users[userKey].homeAddress, creditPoints[msg.sender]);
  // }

  // function getContract(address _contractID) public view 
  //   returns (LoanContract.personType,LoanContract.personType,uint256,string memory,string memory, string memory) {
  //   return (contracts[_contractID].borrower, contracts[_contractID].lender, contracts[_contractID].borrowAmount, contracts[_contractID].purpose, 
  //           contracts[_contractID].contractDate, contracts[_contractID].paybackDate);
  // }
  function createLoan(string memory _contractID, string memory _createdAt, string memory _contractDate, string memory _paybackDate,
                      string memory _purpose, uint _borrowAmount, PersonInfo memory _borrower, PersonInfo memory _lender) public {

    Contract memory new_contract;
    new_contract.contractID = bytes32ToString(keccak256(_contractID));

    new_contract.createdAt = _createdAt;
    new_contract.contractDate = _contractDate;
    new_contract.paybackDate = _paybackDate;
    new_contract.purpose = _purpose;
    new_contract.borrowAmount = _borrowAmount;
    new_contract.borrower = _borrower;
    new_contract.lender = _lender;

    new_contract.status = loanStatus.REQUESTED;

    contracts[msg.sender][new_contract.contractID] = new_contract;

    emit CreateLoan(msg.sender, new_contract.contractID);

  }

  function approveLoan(string memory _contractID, address _borrower) public _borrower {
    
    Contract memory loancontract = contracts[msg.sender][_contractID];
    
    require(loancontract.status == loanStatus.REQUESTED);
    
    contracts[msg.sender][_contractID].status = loanStatus.APPROVED;
        
    emit ApproveLoan(msg.sender, _contractID);
  }

  function rejectLoan(string memory _contractID) public {

    Contract memory loancontract = contracts[msg.sender][_contractID];

    require(loancontract.status == loanStatus.REQUESTED);
    
    contracts[msg.sender][_contractID].status = loanStatus.REJECTED;
    
    emit RejectLoan(msg.sender, _contractID);
  }

  function repayLoan(string memory _contractID, address _lender, uint repayAmount) public _lender{
    
    Contract memory loancontract = contracts[msg.sender][_contractID];

    require(loancontract.status == loanStatus.REQUESTED);

    creditPoints[msg.sender] += 1;
    
    contracts[msg.sender][_contractID].status = loanStatus.REPAYED;
    
    emit ConfirmRepayLoan(msg.sender, _contractID);
  }

  function deleteLoan(string memory _contractID) public {

    delete contracts[msg.sender][_contractID];

    emit DeleteLoan(msg.sender, _contractID);
  }

  function toBytesFromAddress(address a) internal pure returns (bytes memory b) {
    assembly {
      let m := mload(0x40)
      mstore(add(m, 20), xor(0x140000000000000000000000000000000000000000, a))
      mstore(0x40, add(m, 52))
      b := m
    }
  }
    
  function toBytesFromUint(uint256 x) internal pure returns (bytes memory b) {
    b = new bytes(32);
    assembly { 
      mstore(add(b, 32), x) 
    }
  }
    
  function bytes32ToString (bytes32 data) internal pure returns (string memory) {
    bytes memory bytesString = new bytes(32);
    for (uint j=0; j<32; j++) {
      byte char = byte(bytes32(uint(data) * 2 ** (8 * j)));
      if (char != 0) {
          bytesString[j] = char;
      }
    }
    return string(bytesString);
  }

  function() public{
    revert();
  }

}
