# Lottery system on Ethereum Testnet Goerli Blockchain using Solidity and Smart Contract #

## Installation ##

```
cd Lottery
npm install
```

```
cd Front
npm install
```

## Deploy Smart Contract ##

1/ Create .env in Lottery folder and put your TEST account. **Don't use your real account.**

```
PRIVATE_KEY=**** **** **** **** **** **** **** **** **** **** **** ****
INFURA_URL=******
```

2/ Call deploy script in order to deploy the smart contract on Goerli Testnet
```
cd Lottery
npm run deploy
```

3/ Copy the interface and your account address from terminal

## Set up the front application ##

Put copied information and pasted it in /src/utils/lottery.js

```
npm start
```

Go to localhost:3000

## Tests Smart Contract ##

With Mocha

```
cd Lottery
npm run test
```

## App Result ##

<img src="https://res.cloudinary.com/dj6sc2eiq/image/upload/v1673895646/solidity-lottery/Screenshot_from_2023-01-16_20-00-32_luapce.png">
