const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());
const { abi, evm } = require("../compile");

let accounts;
let lottery;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    lottery = await new web3.eth.Contract(abi)
      .deploy({
        data: evm.bytecode.object,
      })
      .send({ from: accounts[0], gas: "1000000" });
});

describe("Lottery contract", () => {
    it("should deploy a contract", () => {
      assert.ok(lottery.options.address);
    });
    it("should allows one account to enter", async () => {
      await lottery.methods.enter().send({
          from: accounts[0],
          value: web3.utils.toWei('0.02', 'ether')
      });
      const players = await lottery.methods.getPlayers().call({
          from: accounts[0]
      });
      assert.equal(accounts[0], players[0]);
      assert.equal(1, players.length);
    });
    it("should allows multiple accounts to enter", async () => {
      for (let i = 0; i < 10; i++) {
        await lottery.methods.enter().send({
          from: accounts[i],
          value: web3.utils.toWei("0.02", "ether"),
        });
      }
      const players = await lottery.methods.getPlayers().call({
        from: accounts[0],
      });
      for (let i = 0; i < players.length; i++) {
        assert.equal(accounts[i], players[i]);
      }
      assert.equal(10, players.length);
    });
    it("should require a minimum amount of ether to enter", async () => {
        try {
            await lottery.methods.enter().send({
              from: accounts[0],
              value: web3.utils.toWei("0.002", "ether"),
            });
            const players = await lottery.methods.getPlayers().call({
              from: accounts[0],
            });
            assert.equal(1, players.length);
        } catch (err) {
            assert(err);
        }
    });
    it("should restrict pickWinner function to manager", async () => {
        try {
            await lottery.methods.pickWinner().send({
                from: accounts[1]
            });
            assert(false);
        } catch (err) {
            assert(err);
        }
    });
    it("should send money to the winner and reset the players array", async () => {
        const gameManager = accounts[0];
        const player = accounts[1];
        const amountPlayed = web3.utils.toWei("2", "ether");
        await lottery.methods.enter().send({
          from: player,
          value: amountPlayed,
        });
        const newSmartContractBalance = await web3.eth.getBalance(
            lottery.options.address
        );
        assert.equal(amountPlayed, newSmartContractBalance);
        const initialBalance = await web3.eth.getBalance(player);
        await lottery.methods.pickWinner().send({ from: gameManager });
        const finalBalance = await web3.eth.getBalance(player);
        const difference = finalBalance - initialBalance;
        const players = await lottery.methods.getPlayers().call({
            from: gameManager,
        });
        const resetSmartContractBalance = await web3.eth.getBalance(
            lottery.options.address
        );
        assert(difference > web3.utils.toWei("1.9", "ether"));
        assert.equal(0, players.length);
        assert.equal(0, resetSmartContractBalance);
    });
});
