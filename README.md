# FriendChance <친구찬스>

###### 제7회 핀테크×인슈어테크 해커톤 (11/29~11/30) 16팀 지킬건기키자 <김예준 정진우 박진영 강민주>
###### 블록체인 기술 기반 차용증 발급을 통한 개인 간 안심 금전 거래 서비스

### start server

in api-express directory:

`yarn install`

`yarn start`

`localhost:8080`

### start client 

in frontend directory:

`npm install`

`npm start`

`localhost:3000`

### start Ethereum node

1) testnet
you may start the Ethereum node, connect to other peer nodes and start downloading the blockchain by: 

ethereum testnet rinkeby
[https://rinkeby.etherscan.io/](https://rinkeby.etherscan.io/)

`geth --rinkeby --syncmode "fast" --rpc --rpcapi db,eth,net,web3,personal --cache=1024 --rpcport 8545 --rpcaddr 127.0.0.1 --rpccorsdomain "*"`

2) private network 

init .genesis.json in private\chain/chaindata
`geth --datadir=./chaindata/ init ./genesis.json`
`geth --datadir=./chaindata/`

start geth
`geth --dev --rpc --rpcport 8545 --rpcaddr 127.0.0.1 --rpcapi="eth,net,web3" --mine --minerthreads=1 --unlock <Account>
truffle migrate --network dev
/Applications/Ethereum\ Wallet.app/Contents/MacOS/Ethereum\ Wallet --rpc http://localhost:8545`

3) use ganache (prefered)

=> init workspace using truffle-config.js in ganache GUI

or use ganache-cli to start ganache server 
`ganache-cli "<mneonics>"`


### deploy loan Smart Contract to blockchain

where truffle-config.js is located:

`truffle compile`

`truffle develop`

migrate contract to blockchain created by Ganache
`truffle migrate`

use this command when redo:
`truffle migrate --reset --compile-all`

`localhost:7545`

### testing

use truffle console to write web3 commands to call functions in loan smart contract





