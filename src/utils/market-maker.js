// TODO: FLAG = 0 when not init yet.

const { Account, Transaction, PublicKey } = require("@project-serum/anchor").web3;
const { OpenOrdersPda, DexInstructions } = require("@project-serum/serum");
const Base58 = require('base-58')
const { DEX_PID } = require('./common')
const {MARKET_KP} = require('./market-lister')
// Dummy keypair.

// 9V5ySLS2jnAGpMrSxAosheo46tkmPAapUxJXRRR6Qq4B
const KEYPAIR = new Account([
  83, 142,  66, 242, 133,  85, 109,  48,  93, 182,  64,
  65,  23, 144, 248,  80, 165, 155, 176, 126, 242,  28,
  27, 172, 139,  53, 200, 226, 145, 147, 102, 115, 126,
  15,  97, 144,  87, 178, 236,  30, 167, 253, 101, 234,
 189, 108,   4,   4, 173,   0, 163,  78,  44, 185,  93,
   5, 177,  53,  70, 253,  20, 202,  39,  96
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
