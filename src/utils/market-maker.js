// TODO: FLAG = 0 when not init yet.

const { Account, Transaction, PublicKey } = require("@project-serum/anchor").web3;
const { OpenOrdersPda, DexInstructions } = require("@project-serum/serum");
const Base58 = require('base-58')
const { DEX_PID } = require('./common')
const { MARKET_KP } = require('./market-lister')
const { OpenOrders, Market } = require('@project-serum/serum');
const { MarketProxyInstruction } = require("@project-serum/serum/lib/market-proxy");
// Dummy keypair.

const KEYPAIR = new Account();


const admin = new Account(Base58.decode('4EHnNBG9jfvU2RE5bgXd9Fzn6bbKTnDdvVeQmJScpLTFyMyAy7QcLdnLuxEz7fqJLbHdZg6pZggGmumPX8hbA5Qg'))
// For9GCz5oSNic3vpLwtSq3aKeqNEbTqBrtEpMQYRKY7i
// const OPENORDERS = new Account()

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

async function matchOrders(connection, provider, marketProxy, marketMakerAccounts) {

  const openOrdersAddressKey = await OpenOrdersPda.openOrdersAddress(
    marketProxy.market.address,
    marketMakerAccounts.account.publicKey,
    marketProxy.dexProgramId,
    marketProxy.proxyProgramId
  );
  

  const myMarket = await Market.load(connection, marketProxy.market.address, {}, DEX_PID, undefined)
  console.log(marketProxy.market.address.toString())
  console.log('orderbook before matching...')

  let openOrderOfOwners = await myMarket.loadOrdersForOwner(connection, openOrdersAddressKey)
  let countSell = 0
  let countBuy = 0
  for (let e of openOrderOfOwners) {
      countBuy += (e.side === 'buy')
      countSell += (e.side === 'sell')
      console.log(e)
  }

  console.log(countBuy) 
  console.log(countSell)

  const marketProxyInstruction = marketProxy.instruction
  for (let e of openOrderOfOwners) {
    const tx = new Transaction()
    tx.add(
      marketProxyInstruction.cancelOrder(openOrdersAddressKey, e)
    )
    const txhash = await provider.send(tx, [marketMakerAccounts.account])
    console.log(txhash)
  }

  console.log('After cancelling...')
  openOrderOfOwners = await myMarket.loadOrdersForOwner(connection, openOrdersAddressKey)
  countSell = 0
  countBuy = 0
  for (let e of openOrderOfOwners) {
      countBuy += (e.side === 'buy')
      countSell += (e.side === 'sell')
      console.log(e)
  }

  console.log(countBuy) 
  console.log(countSell)


  // console.log('start matching')
  // txHash = await myMarket.matchOrders(connection, marketMakerAccounts.account)
  // console.log(`matching tx: ${txHash}`)


  // console.log('loading bids')
  // const bids = await myMarket.loadBids(connection)
  //   for (let e of bids.slab.nodes) {
  //       if (e.leafNode === undefined) {
  //           continue
  //       }
  //       console.log(e.leafNode.owner.toString())
  //       console.log(e.leafNode.quantity.toString())
  //   }
}

module.exports = {
  postOrders,
  initOpenOrders,
  KEYPAIR,
  matchOrders
};
