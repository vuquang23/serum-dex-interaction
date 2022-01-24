// TODO: FLAG = 0 when not init yet.

const { Account, Transaction, PublicKey } = require("@project-serum/anchor").web3;
const { OpenOrdersPda, DexInstructions } = require("@project-serum/serum");
const Base58 = require('base-58')
const { DEX_PID } = require('./common')
const {MARKET_KP} = require('./market-lister')
// Dummy keypair.

// J2wNUJkNBbMgpWSxT6staSUdfnuk9EjMiPVSm5wfMSR1
const KEYPAIR = new Account([
  114, 152, 121, 134, 171,   9,  58,  13,  67, 140,  51,
   52, 202, 164,  42,  91, 155,  34, 218, 165,  17, 175,
  243, 165, 200, 189,   7,  56,  94, 253,  99, 193, 253,
   21, 188,  48, 252,  92,  85, 239,  45, 148, 235, 204,
  183,  47, 255, 118,  85,  84, 164, 226,  84, 200, 230,
   28, 231,  58,  85,  66, 204, 156,  17,  52
]);

const REFERAL = new Account(Base58.decode('5VE8dNKet98A1G1VWLTatt7hGNNmFf7Pd1ptQsPNBD5vrLfpg6kZ2drYyMU4i8JNGbMogNiwX1YWGZK47eokX559'))

// For9GCz5oSNic3vpLwtSq3aKeqNEbTqBrtEpMQYRKY7i
const OPENORDERS = new Account([
  163,  58, 119,  31,   5, 241, 132, 148,  39, 144, 185,
   41,  32, 122, 236,  96, 122, 229,  94, 200,  70, 207,
   79, 116,  55, 184,  69,  91, 111, 249, 160,  19, 220,
    3, 230,  84, 237,  12,  32, 136, 182, 202, 187, 159,
   45, 224, 189, 184, 192,  77,  47,  23,  45,  71, 187,
   74, 231, 131, 105,  93, 223, 130, 222,  81
])

async function initOpenOrders(provider, marketProxy, marketMakerAccounts) {
  const tx = new Transaction();

  // initOpenOrders(owner: PublicKey, market: PublicKey, openOrders: PublicKey, marketAuthority: PublicKey): TransactionInstruction;

  tx.add(
    marketProxy.instruction.initOpenOrders(
      marketMakerAccounts.account.publicKey,
      MARKET_KP.publicKey,
      OPENORDERS.publicKey,
      new PublicKey('77UZipGaVojPh1cm1M8fJKJCisRVKgN47GbT2dg47GPk')
    )
  );

  let signers = [marketMakerAccounts.account, OPENORDERS.KEYPAIR, REFERAL.KEYPAIR];
  const txHash = await provider.send(tx, signers);
  console.log(txHash)
}

async function postOrders(provider, marketProxy, marketMakerAccounts) {
  const asks = [
    [6.041, 7.8],
    [6.051, 72.3],
    [6.055, 5.4],
  ];
  const bids = [
    [6.004, 8.5],
    [5.995, 12.9],
    [5.987, 6.2],
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
