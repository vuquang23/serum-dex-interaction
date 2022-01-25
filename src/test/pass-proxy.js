require('dotenv').config()
const { Transaction } = require("@solana/web3.js")
const { DexInstructions } = require('@project-serum/serum')
const Base58 = require('base-58')
const { Connection, Account, PublicKey, Keypair } = require('@project-serum/anchor').web3
const { Provider, Wallet, Program } = require('@project-serum/anchor')
const marketMaker = require("../utils/market-maker");

const PROXY_PROGRAMID = new PublicKey('EUdtZVeXMQoqZwyK8fFRoTMDbs9WwW1VAvkMDrdDhbnu')
const CONNECTION = new Connection('https://api.devnet.solana.com')
const WALLET = new Wallet(Keypair.fromSecretKey(Base58.decode(process.env.PRIVATEKEY)))
const PROVIDER = new Provider(CONNECTION, WALLET, {})
const BN = require('bn.js')

async function passProxy() {
    const tx = new Transaction()
    const instruction = DexInstructions.newOrderV3({
        market: new PublicKey('4ewibe2KVJ3YJteLqk7kSL5ZDDewfbkU1LcU1Lp9ihi1'),
        openOrders: new PublicKey('For9GCz5oSNic3vpLwtSq3aKeqNEbTqBrtEpMQYRKY7i'),
        payer: new PublicKey('46kTRVJaqdecmpie9xnbRLJqewj5ix3aj2k8ZDWK5jqP'),
        owner: new PublicKey('J2wNUJkNBbMgpWSxT6staSUdfnuk9EjMiPVSm5wfMSR1'),
        requestQueue: new PublicKey('FCbtUxPZyvpN1j5qwyaqG2Jbtmg9hBxLWC4w9Pq18r45'),
        eventQueue: new PublicKey('CXNHjfbt3uWk5BLwzJEPrnvXSqVWaxQazBaeaEydr4LK'),
        bids: new PublicKey('AChSGt7XP9iwkGynjUMB46gboRjmpUAqchyEYEjqiPBa'),
        asks: new PublicKey('9Uvt3d4SR1hRoF7pwpkpEz8cHsKu5ueQUkArndBypQx2'),
        baseVault: new PublicKey('3abZDMoD6fFehnpufwPxcmRwj6HiDRdMoF5XPoWt1YCJ'), //
        quoteVault: new PublicKey('7EFc5TmGJCMHjJ8fdPiSdFKLRyrP7x9Kk8zJcbBeKrc3'), //
        side: "sell",
        limitPrice: new BN(1),
        maxBaseQuantity: new BN(10),
        maxQuoteQuantity: new BN(10),
        orderType: 'postOnly',
        clientId: undefined,
        programId: new PublicKey('DSgEyE3kT8yK4Je9RSyQcPZrn6bao8nd7cq8KBtgyiz6'),
        selfTradeBehavior: 'abortTransaction',
        feeDiscountPubkey: null,
    })
    // console.log(instruction)

    tx.add(instruction)
    const signers = [marketMaker.KEYPAIR]
    const txHash = await PROVIDER.send(tx, signers)
    console.log(txHash)
}

// 7jYrcQ6PRz4UT6Pk3zBV9hwkY3iPWfMSTdrMcpNSYza6
const OPENORDERS = new Account([
    46, 101,  89,  35, 112,  38, 216,  23, 103, 152, 201,
   177,  30,  99,  81,  57, 168, 130, 162,  14,  62, 222,
    22, 161,  85,  17,  50,  47,  76,   5, 101, 200, 100,
    12, 136, 212, 230,  94, 179, 126, 239, 120, 120, 247,
    64, 133,  80, 143, 238, 111, 228, 232, 189, 174, 144,
    32,  61, 193,  20,  36, 227, 123, 255,  75
 ])
async function createOpenOrders() {
    const tx = new Transaction()
    const instruction = DexInstructions.initOpenOrders({
        market: new PublicKey('4ewibe2KVJ3YJteLqk7kSL5ZDDewfbkU1LcU1Lp9ihi1'),
        openOrders: OPENORDERS.publicKey,
        owner: new PublicKey('J2wNUJkNBbMgpWSxT6staSUdfnuk9EjMiPVSm5wfMSR1'),
        programId: new PublicKey('DSgEyE3kT8yK4Je9RSyQcPZrn6bao8nd7cq8KBtgyiz6'),
        marketAuthority: undefined
    })
    tx.add(instruction)
    const signers = [marketMaker.KEYPAIR, OPENORDERS.KEYPAIR]
    const txHash = await PROVIDER.send(tx, signers)
    console.log(txHash)
}

async function fetchIDL() {
    const result = await Program.fetchIdl('DSgEyE3kT8yK4Je9RSyQcPZrn6bao8nd7cq8KBtgyiz6', PROVIDER)
    console.log(result)
}

async function main() {
    // await fetchIDL()
    await createOpenOrders()
    // await passProxy()
}

main()