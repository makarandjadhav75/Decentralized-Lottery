import web3 from "./web3";

export const etherToWei = (ether) => web3.utils.toWei(ether, "ether");
export const weiToEther = (wei) => web3.utils.fromWei(wei, "ether");
export const defaultAddress = "0x0000000000000000000000000000000000000000";