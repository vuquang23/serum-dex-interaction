// TODO: FLAG = 0 when not init yet.

const { Account, Transaction, PublicKey } = require("@project-serum/anchor").web3;
const { OpenOrdersPda, DexInstructions } = require("@project-serum/serum");
const Base58 = require('base-58')
const { DEX_PID } = require('./common')
const {MARKET_KP} = require('./market-lister')
// Dummy keypair.

// 7LgB8mMbkwWbmXJYWoh4dURUY95sG2qLT2Vxewromxep
const KEYPAIR = new Account(Base58.decode('PmNekW5wuuAFXyFkEnpCGR8ou9RN13rMKJrWH9MwdS4rQ4oqeUBjnADEUmXPmHKi8t9CDsbyaBuqMmTWCv3Wo6C'));

const admin = new Account(Base58.decode('4EHnNBG9jfvU2RE5bgXd9Fzn6bbKTnDdvVeQmJScpLTFyMyAy7QcLdnLuxEz7fqJLbHdZg6pZggGmumPX8hbA5Qg'))

async function initOpenOrders(provider, marketProxy, marketMakerAccounts) {
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

  let signers = [marketMakerAccounts.account, admin];
  const txHash = await provider.send(tx, signers);
  console.log(`init open order account txHash: ${txHash}`)
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
  let signers = [marketMakerAccounts.account, admin];
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
        openOrdersAddressKey: openOrdersAddressKey,
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
        openOrdersAddressKey: openOrdersAddressKey,
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
