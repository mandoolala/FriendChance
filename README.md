# fintech-hackathon-2019
convenient promissory note application between acquaintances using Blockchain

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

init workspace and start blockchain in ganache GUI

or use ganache-cli to start ganache server 
`ganache-cli "<mneonics>"`


### init Loan Smart Contracts

in directory where truffle-config.js is located:

`truffle compile`

`truffle develop`

migrate contract to blockchain created by Ganache
`truffle migrate`

use this command when redo:
`truffle migrate --reset --compile-all`

Deploy Smart Contracts to local blockchain

`npm run migrate:dev`


### testing

use truffle console to write web3 command to call functions in loan smart contract





