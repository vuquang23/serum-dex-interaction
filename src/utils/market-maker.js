// TODO: FLAG = 0 when not init yet.

const { Account, Transaction, PublicKey } = require("@project-serum/anchor").web3;
const { OpenOrdersPda, DexInstructions } = require("@project-serum/serum");
const Base58 = require('base-58')
const { DEX_PID } = require('./common')
const {MARKET_KP} = require('./market-lister')
// Dummy keypair.

// FSWLreXFPDmeHgFH1N8vmb8AuGFe8GydaE95iCHfCSa6
const KEYPAIR = new Account([
  192, 229,  15,  13,  14, 207, 106, 113, 245, 102, 249,
    8, 162, 180, 227, 108, 222,  15,  31, 230, 108, 186,
   10, 252, 151,  48,  86,  12, 191, 156, 146, 154, 214,
  140,  80, 143, 142, 191, 175,  92, 178, 165, 250,  49,
   31,  52,  43, 205, 217, 251,  39, 246, 176, 236, 105,
   49, 129,  77, 236, 244,  31,  73,  93,  91
]);

async function initOpenOrders(provider, marketProxy, marketMakerAccounts) {
  // console.log("Open order", OPENORDERS.publicKey.toString())
  const marketAuthority = await OpenOrdersPda.marketAuthority(
    marketProxy.market.address,
    DEX_PID,
    marketProxy.proxyProgramId
  )
  console.log(`in initOpenOrders - marketAuthority: ${marketAuthority.toString()}`)

  const openOrdersAddressKey = await OpenOrdersPda.openOrdersAddress(
    marketProxy.market.address,
    marketMakerAccounts.account.publicKey,
    marketProxy.dexProgramId,
    marketProxy.proxyProgramId
  );
  console.log(`in initOpenOrders - openOrdersAddresskey: ${openOrdersAddressKey.toString()}`)

  const tx = new Transaction();
  tx.add(
    marketProxy.instruction.initOpenOrders(
      marketMakerAccounts.account.publicKey,
      MARKET_KP.publicKey,
      openOrdersAddressKey,
      marketAuthority
    )
  );

  let signers = [marketMakerAccounts.account];
  const txHash = await provider.send(tx, signers);
  console.log(txHash)
}

async function postOrders(provider, marketProxy, marketMakerAccounts) {
  const asks = [
    [6.041, 7.8],
    [6.000, 8.5]
  ];
  const bids = [
    [6.000, 8.5],
    [6.001, 10],
  ];
  const openOrdersAddressKey = await OpenOrdersPda.openOrdersAddress(
    marketProxy.market.address,
    marketMakerAccounts.account.publicKey,
    marketProxy.dexProgramId,
    marketProxy.proxyProgramId
  );

  // Use an explicit signer because the provider wallet, which pays for
  // the tx, is different from the market maker wallet.
  let signers = [marketMakerAccounts.account];
  for (let k = 0; k < asks.length; k += 1) {
    let ask = asks[k];
    const tx = new Transaction();
    tx.add(
      await marketProxy.instruction.newOrderV3({
        owner: marketMakerAccounts.account.publicKey,
        payer: marketMakerAccounts.baseToken,
        side: "sell",
        price: ask[0],
        size: ask[1],
        orderType: "postOnly",
        clientId: undefined,
        openOrdersAddressKey,
        feeDiscountPubkey: null,
        selfTradeBehavior: "abortTransaction",
      })
    );
    const x = await provider.send(tx, signers);
    console.log(`asks #${k} : ${x}`)
  }

  for (let k = 0; k < bids.length; k += 1) {
    let bid = bids[k];
    const tx = new Transaction();
    tx.add(
      await marketProxy.instruction.newOrderV3({
        owner: marketMakerAccounts.account.publicKey,
        payer: marketMakerAccounts.quoteToken,
        side: "buy",
        price: bid[0],
        size: bid[1],
        orderType: "postOnly",
        clientId: undefined,
        openOrdersAddressKey,
        feeDiscountPubkey: null,
        selfTradeBehavior: "abortTransaction",
      })
    );
    const x = await provider.send(tx, signers);
    console.log(`bids #${k} : ${x}`)
  }
}

module.exports = {
  postOrders,
  initOpenOrders,
  KEYPAIR,
};
