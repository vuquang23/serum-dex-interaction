const { OpenOrders, Market, OpenOrdersPda } = require('@project-serum/serum')
const { web3, Wallet, Provider } = require('@project-serum/anchor')
const Base58 = require('base-58')
const { PublicKey, Transaction } = require('@solana/web3.js')
const marketProxy = require('./utils/market-proxy')
const { MarketProxyInstruction } = require('@project-serum/serum/lib/market-proxy')
require('dotenv').config()



async function alice() {
    //TODO: when using proxy, use func in proxy folder, wrong to use func in not proxy.
    //TODO: when using myMarket -> owner = openorder
    const root = new Wallet(web3.Keypair.fromSecretKey(Base58.decode(process.env.PRIVATEKEY)))
    const owner = new web3.Account([
        83, 142, 66, 242, 133, 85, 109, 48, 93, 182, 64,
        65, 23, 144, 248, 80, 165, 155, 176, 126, 242, 28,
        27, 172, 139, 53, 200, 226, 145, 147, 102, 115, 126,
        15, 97, 144, 87, 178, 236, 30, 167, 253, 101, 234,
        189, 108, 4, 4, 173, 0, 163, 78, 44, 185, 93,
        5, 177, 53, 70, 253, 20, 202, 39, 96
    ]) //9V5ySLS2jnAGpMrSxAosheo46tkmPAapUxJXRRR6Qq4B

    const connection = new web3.Connection("https://api.devnet.solana.com/")
    const marketAddress = new PublicKey("Ct9Sz8G9ob4MS9roTshd4paTVidAMVSNwnsikgdiPXuH")
    const programID = new PublicKey('DSgEyE3kT8yK4Je9RSyQcPZrn6bao8nd7cq8KBtgyiz6')
    const proxyProgramID = new PublicKey('EUdtZVeXMQoqZwyK8fFRoTMDbs9WwW1VAvkMDrdDhbnu')
    const myMarket = await Market.load(connection, marketAddress, {}, programID, undefined)
    const openOrdersAddressKey = new PublicKey('h5j7AaENLMxRDg1SyNZKdf5bp8ncumJjwwr35h68Ucg')
    const PROVIDER = new Provider(connection, root, {})
    console.log(owner.publicKey.toBase58())

    const marketProxyClient = await marketProxy.load(
        PROVIDER.connection,
        proxyProgramID,
        programID,
        marketAddress
    );

    //TODO: openOrdersAddress
    // const openOrdersAddressKey = await OpenOrdersPda.openOrdersAddress(
    //     marketAddress,
    //     owner.publicKey,
    //     programID,
    //     proxyProgramID
    // );

    // console.log(owner.publicKey.toString())

    //TODO: findForMarketAndOwner
    // const result = await OpenOrders.findForMarketAndOwner(connection, marketAddress, openOrdersAddressKey, programID)
    // console.log(result)
    // console.log(result[0].owner.toString())

    // const result2 = await OpenOrders.findForOwner(connection, openOrdersAddressKey, programID)
    // console.log(result2)


    //TODO: loadBids
    // const bids = await myMarket.loadBids(connection)
    // // console.log(bids)
    // for (let e of bids.slab.nodes) {
    //     if (e.leafNode === undefined) {
    //         continue
    // }
    // console.log(e.leafNode.owner.toString())
    // console.log(e.leafNode.quantity.toString())
    // console.dir(e.leafNode, {depth: null})
    // }

    // TODO: loadAsks
    // console.dir(bids, {depth: null})
    // const asks = await myMarket.loadAsks(connection)
    // console.dir(asks, {depth: null})

    // console.log(myMarket.asksAddress.toString())

    //TODO: add bid (buy)
    // const bids = [
    //     [6.5, 20],
    // ];
    // for (let e of bids) {
    //     const tx = new Transaction()
    //     tx.add(
    //         marketProxyClient.instruction.newOrderV3(
    //             {
    //                 owner: owner.publicKey,
    //                 payer: new PublicKey('Cn1JM7SGSLZt2wDEYf27DPh5TQZvceUgrH4izqUoQFf3'),
    //                 side: 'buy',
    //                 price: e[0],
    //                 size: e[1],
    //                 orderType: "postOnly",
    //                 clientId: undefined,
    //                 openOrdersAddressKey: openOrdersAddressKey,
    //                 selfTradeBehavior: "abortTransaction",
    //             }
    //         )
    //     )
    //     const signers = [owner]
    //     const txHash = await connection.sendTransaction(tx, signers)
    //     console.log(txHash)
    // } 

    //TODO: add ask (sell)
    // const ask = [
    //     [6.000, 8.5],
    //     [6.001, 10],
    // ];
    
    // for (let k = 0; k < ask.length; k += 1) {
    //     let ak = ask[k];
    //     const tx = new Transaction();
    //     console.log(`owner: ${owner.publicKey}`)
    //     tx.add(
    //         marketProxyClient.instruction.newOrderV3({
    //             owner: owner.publicKey,
    //             payer: new PublicKey('ACLS9NJcRt1q1ZKvJ3Fx3JvpJ9AraGPwaFBnMmN5oeZC'),
    //             side: "sell",
    //             price: ak[0],
    //             size: ak[1],
    //             orderType: "postOnly",
    //             clientId: undefined,
    //             openOrdersAddressKey,
    //             feeDiscountPubkey: null,
    //             selfTradeBehavior: "abortTransaction",
    //         })
    //     );
    //     let signers = [owner];
    //     const x = await PROVIDER.send(tx, signers);
    //     console.log(`asks #${k} : ${x}`)
    // }

    //TODO: loadOrdersForOwner
    const openOrderOfOwners = await myMarket.loadOrdersForOwner(connection, openOrdersAddressKey)
    let countBuy = 0
    let countSell = 0
    for (let e of openOrderOfOwners) {
        countBuy += (e.side === 'buy')
        countSell += (e.side === 'sell')
        console.log(e)
    }
    console.log(countBuy)
    console.log(countSell)

    //TODO: cancel
    // const openOrderOfOwners = await myMarket.loadOrdersForOwner(connection, openOrdersAddressKey)
    // let countBuy = 0
    // let countSell = 0
    // for (let e of openOrderOfOwners) {
    //     countBuy += (e.side === 'buy')
    //     countSell += (e.side === 'sell')
    //     const tx = new Transaction()
    //     tx.add(
    //         marketProxyClient.instruction.cancelOrder(owner.publicKey, e)
    //     )
    //     const signers = [owner]
    //     const txHash = await connection.sendTransaction(tx, signers)
    //     console.log(txHash)
    // }
    // console.log(countBuy)
    // console.log(countSell)

    //TODO: loadRequestQueue
    // const requestQueue = await myMarket.loadRequestQueue(connection)
    // console.log(requestQueue)

    //TODO: loadEventQueue
    // const eventQueue = await myMarket.loadEventQueue(connection)
    // console.log(eventQueue)
    // let count = 0
    // for (let e of eventQueue) {
    //     console.log(`#${count}`)
    //     count++

    //     console.log(`orderID: ${e.orderId.toString()}`)
    //     console.log(`openOrders: ${e.openOrders.toString()}`)
    //     console.log(`nativeQuantityReleased: ${e.nativeQuantityReleased.toString()}`)
    //     console.log(`nativeQuantityPaid: ${e.nativeQuantityPaid.toString()}`)
    // }


    //TODO: matchOrders
    // const txHash = await myMarket.matchOrders(connection, root)
    // console.log(txHash)

    //TODO: findOpenOrdersAccountsForOwner
    // const openOrdersAccount = await myMarket.findOpenOrdersAccountsForOwner(connection, openOrdersAddressKey)
    // console.log(openOrdersAccount)
}


async function bob() {
    //TODO: when using proxy, use func in proxy folder, wrong to use func in not proxy.
    //TODO: when using myMarket -> owner = openorder
    const root = web3.Keypair.fromSecretKey(Base58.decode(process.env.PRIVATEKEY))
    const owner = new web3.Account([
        192, 229, 15, 13, 14, 207, 106, 113, 245, 102, 249,
        8, 162, 180, 227, 108, 222, 15, 31, 230, 108, 186,
        10, 252, 151, 48, 86, 12, 191, 156, 146, 154, 214,
        140, 80, 143, 142, 191, 175, 92, 178, 165, 250, 49,
        31, 52, 43, 205, 217, 251, 39, 246, 176, 236, 105,
        49, 129, 77, 236, 244, 31, 73, 93, 91
    ])

    const connection = new web3.Connection("https://api.devnet.solana.com/")
    const marketAddress = new PublicKey("Ct9Sz8G9ob4MS9roTshd4paTVidAMVSNwnsikgdiPXuH")
    const programID = new PublicKey('DSgEyE3kT8yK4Je9RSyQcPZrn6bao8nd7cq8KBtgyiz6')
    const proxyProgramID = new PublicKey('EUdtZVeXMQoqZwyK8fFRoTMDbs9WwW1VAvkMDrdDhbnu')
    const myMarket = await Market.load(connection, marketAddress, {}, programID, undefined)
    const openOrdersAddressKey = new PublicKey('FmofqPk7s51qKuY8W7DW9ZpVrv4wcWJxMu3kPRrohGdJ')
    console.log(owner.publicKey.toBase58())

    const marketProxyClient = await marketProxy.load(
        connection,
        proxyProgramID,
        programID,
        marketAddress
    );

    // console.log(`asksAddress: ${myMarket.asksAddress}`)
    // console.log(`bidsAddress: ${myMarket.bidsAddress}`)

    //TODO: openOrdersAddress
    // const openOrdersAddressKey = await OpenOrdersPda.openOrdersAddress(
    //     marketAddress,
    //     owner.publicKey,
    //     programID,
    //     proxyProgramID
    // );
    // console.log(openOrdersAddressKey.toString())  

    //TODO: findForMarketAndOwner
    // const result = await OpenOrders.findForMarketAndOwner(connection, marketAddress, openOrdersAddressKey, programID)
    // console.log(result)
    // console.log(result[0].owner.toString())

    // const result2 = await OpenOrders.findForOwner(connection, openOrdersAddressKey, programID)
    // console.log(result2)


    //TODO: loadBids
    // const bids = await myMarket.loadBids(connection)
    // console.log(bids)
    // for (let e of bids.slab.nodes) {
    //     if (e.leafNode === undefined) {
    //         continue
    //     }
    //     console.log(e.leafNode.owner.toString())
    //     console.log(e.leafNode.quantity.toString())
    // }

    // TODO: loadAsks
    // const asks = await myMarket.loadAsks(connection)
    // console.dir(asks, {depth: null})


    //TODO: add bid (buy)
    // const bids = [
    //     [6.001, 8],
    // ]
    // for (let e of bids) {
    //     const tx = new Transaction()
    //     tx.add(
    //         marketProxyClient.instruction.newOrderV3(
    //             {
    //                 owner: owner.publicKey,
    //                 payer: new PublicKey('AHqVzyKgq6KGajxXtj7dbgLMt5oEz6iqnxZ97NNHXXTc'),
    //                 side: 'buy',
    //                 price: e[0],
    //                 size: e[1],
    //                 orderType: "postOnly",
    //                 clientId: undefined,
    //                 openOrdersAddressKey: openOrdersAddressKey,
    //                 selfTradeBehavior: "abortTransaction",
    //             }
    //         )
    //     )
    //     const signers = [owner]
    //     const txHash = await connection.sendTransaction(tx, signers)
    //     console.log(txHash)
    // } 

    // TODO: add ask (sell)
    // const ask = [
    //     [3, 5],
    //     [3.5, 6],
    // ];
    // for (let e of ask) {
    //     const tx = new Transaction()
    //     tx.add(
    //         marketProxyClient.instruction.newOrderV3(
    //             {
    //                 owner: owner.publicKey,
    //                 payer: new PublicKey('2A7ekP1h4v46YPABuq2mzGEU7eLLkYurs7b91NpvnfkD'),
    //                 side: 'sell',
    //                 price: e[0],
    //                 size: e[1],
    //                 orderType: "postOnly",
    //                 clientId: undefined,
    //                 openOrdersAddressKey: openOrdersAddressKey,
    //                 selfTradeBehavior: "abortTransaction",
    //             }
    //         )
    //     )
    //     const signers = [owner]
    //     const txHash = await connection.sendTransaction(tx, signers)
    //     console.log(txHash)
    // } 

    //TODO: loadOrdersForOwner
    const openOrderOfOwners = await myMarket.loadOrdersForOwner(connection, openOrdersAddressKey)
    let countBuy = 0
    let countSell = 0
    for (let e of openOrderOfOwners) {
        countBuy += (e.side === 'buy')
        countSell += (e.side === 'sell')
        console.log(e)
    }
    console.log(countBuy)
    console.log(countSell)

    //TODO: cancel
    // const openOrderOfOwners = await myMarket.loadOrdersForOwner(connection, openOrdersAddressKey)
    // let countBuy = 0
    // let countSell = 0
    // for (let e of openOrderOfOwners) {
    //     countBuy += (e.side === 'buy')
    //     countSell += (e.side === 'sell')
    //     const tx = new Transaction()
    //     tx.add(
    //         marketProxyClient.instruction.cancelOrder(owner.publicKey, e)
    //     )
    //     const signers = [owner]
    //     const txHash = await connection.sendTransaction(tx, signers)
    //     console.log(txHash)
    // }
    // console.log(countBuy)
    // console.log(countSell)

    //TODO: findOpenOrdersAccountsForOwner
    // const openOrdersAccount = await myMarket.findOpenOrdersAccountsForOwner(connection, openOrdersAddressKey)
    // console.dir(openOrdersAccount, { depth: null })
    // for(let e of openOrdersAccount[0].orders) {
    //     console.log(e.toString())
    // }
}



// alice()
bob()
