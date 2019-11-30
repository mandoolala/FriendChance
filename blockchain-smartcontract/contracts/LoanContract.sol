pragma solidity >=0.4.22 <0.7.0;
pragma experimental ABIEncoderV2;

contract LoanContract {

  enum personType {Borrower, Lender}
  enum loanStatus {REQUESTED, APPROVED, REJECTED, ACTIVATED, REPAYED}

  struct PersonInfo{
    personType identifier;
    //string id;
    string name;
    string identityNumber;
    string homeAddress;

    //PersonInfo[] BorrowList;
    //PersonInfo[] LendList;
  }

  struct Contract{

    uint id;
    //address contractID;

    loanStatus status;
    string state;

    PersonInfo borrower;
    PersonInfo lender;

    string borrower_ID;
    string lender_ID;

    uint256 borrowAmount;
  
    string purpose;
    //string borrowCondition;

    string createdAt; //초안 생긴 시점
    uint256 contractDate; //효력이 생기는 시점
    string paybackDate; // 돈 갚을 날짜

    bool borrower_signature; 
    bool lender_signature;
  }

  mapping (address => PersonInfo) users;
  mapping (address => uint) creditPoints;
  Contract[] contractsList;

  //mapping (address => mapping(string => Contract)) public contracts;
  //mapping (uint => Contract) public contractsMap;
  //mapping (address=>uint[]) public lendMap;
  //mapping (string => Contract) private loanContracts;

  //uint loanCount = 0;

  event Register(address, string, string, string);

  event CreateLoan(address, uint); //borrower
  event ApproveLoan(address, uint, address); //lender
  event RejectLoan(address, uint); //lender
  event DeleteLoan(address); //if rejected by lender
  event ActivateLoan(address, uint); //borrower when received money
  event ConfirmRepayLoan(address, uint); //lender

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

  function updateState(uint id, string memory newState) public returns (uint) {
    Contract storage temp_contract = contractsList[id];
    temp_contract.state = newState;
    return id;
  }

  function createLoan(uint _id, string memory _createdAt, string memory _purpose, uint _borrowAmount, string memory _paybackDate, string memory borrowerId) public {

    Contract memory new_contract;
    //new_contract.contractID = bytes32ToString(keccak256(_contractID));
    new_contract.id = _id;
    new_contract.createdAt = _createdAt;
    new_contract.paybackDate = _paybackDate;
    new_contract.purpose = _purpose;
    new_contract.borrowAmount = _borrowAmount;
    new_contract.borrower_ID = borrowerId;
    //new_contract.lender_ID = _lender;

    new_contract.status = loanStatus.REQUESTED;
    contractsList.push(new_contract);
    //contractsMap[loanCount] = new_contract;

    //loanCount++;

    //contracts[msg.sender][new_contract.contractID] = new_contract;
    emit CreateLoan(msg.sender, new_contract.id);
  }

  function approveLoan(uint id, address _borrower) public {
    
    //Contract memory loancontract = contractsMap[msg.sender][_contractID];
    Contract storage temp_contract = contractsList[id];

    require(temp_contract.status == loanStatus.REQUESTED);
    
    //contractsMap[msg.sender][_contractID].status = loanStatus.APPROVED;
    temp_contract.status = loanStatus.APPROVED;

    temp_contract.borrower_signature = true;
    temp_contract.lender_signature = true;

    //msg.sender is lender

    emit ApproveLoan(msg.sender, id, _borrower);
  }

  function activateLoan(uint id, address _lender) public {

    //Contract memory loancontract = contractsMap[msg.sender][_contractID];
    Contract storage temp_contract = contractsList[id];

    require(temp_contract.status == loanStatus.APPROVED);

    //contractsMap[msg.sender][_contractID].status = loanStatus.APPROVED;
    temp_contract.status = loanStatus.ACTIVATED;
    temp_contract.contractDate = block.timestamp;

    //msg.sender is borrower

    emit ActivateLoan(msg.sender, id);
  }

  function rejectLoan(uint id) public {

    //Contract memory loancontract = contractsMap[msg.sender][_contractID];
    Contract storage temp_contract = contractsList[id];

    require(temp_contract.status == loanStatus.REQUESTED);
    
    //contractsMap[msg.sender][_contractID].status = loanStatus.REJECTED;
    temp_contract.status = loanStatus.REJECTED;
    
    emit RejectLoan(msg.sender, id);
  }

  function repayLoan(uint id, address _lender, uint repayAmount) public {
    
    //Contract memory loancontract = contractsMap[msg.sender][_contractID];
    Contract storage temp_contract = contractsList[id];

    require(temp_contract.status == loanStatus.REQUESTED);

    creditPoints[msg.sender] += 1;
    
    //contractsMap[msg.sender][_contractID].status = loanStatus.REPAYED;
    temp_contract.status = loanStatus.REPAYED;
    
    emit ConfirmRepayLoan(msg.sender, id);
  }

  function deleteLoan(uint id) public {

    //delete contractsMap[msg.sender][_contractID];
    //Contract storage temp_contract = contractsList[id];
  
    //loanCount--;

    emit DeleteLoan(msg.sender);
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

  function stringToBytes32(string memory source) private pure returns (bytes32 result) {
    bytes memory tempEmptyStringTest = bytes(source);
    if (tempEmptyStringTest.length == 0) {
        return 0x0;
    }
    assembly {
        result := mload(add(source, 32))
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

  function() external{
    revert();
  }

}
