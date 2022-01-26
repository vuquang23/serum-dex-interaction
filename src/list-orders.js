const { OpenOrders, Market, OpenOrdersPda } = require('@project-serum/serum')
const { web3, Wallet } = require('@project-serum/anchor')
const Base58 = require('base-58')
const { PublicKey } = require('@solana/web3.js')
require('dotenv').config()

async function main() {
    const root = web3.Keypair.fromSecretKey(Base58.decode(process.env.PRIVATEKEY))
    const owner = new web3.Account([
        83, 142,  66, 242, 133,  85, 109,  48,  93, 182,  64,
        65,  23, 144, 248,  80, 165, 155, 176, 126, 242,  28,
        27, 172, 139,  53, 200, 226, 145, 147, 102, 115, 126,
        15,  97, 144,  87, 178, 236,  30, 167, 253, 101, 234,
       189, 108,   4,   4, 173,   0, 163,  78,  44, 185,  93,
         5, 177,  53,  70, 253,  20, 202,  39,  96
    ])

    const connection = new web3.Connection("https://api.devnet.solana.com/")
    const marketAddress = new PublicKey("Ct9Sz8G9ob4MS9roTshd4paTVidAMVSNwnsikgdiPXuH")
    const programID = new PublicKey('DSgEyE3kT8yK4Je9RSyQcPZrn6bao8nd7cq8KBtgyiz6')
    const proxyProgramID = new PublicKey('EUdtZVeXMQoqZwyK8fFRoTMDbs9WwW1VAvkMDrdDhbnu')
    const myMarket = await Market.load(connection, marketAddress, {}, programID, undefined)

    const openOrdersAddressKey = new PublicKey('h5j7AaENLMxRDg1SyNZKdf5bp8ncumJjwwr35h68Ucg')
    // const openOrdersAddressKey = await OpenOrdersPda.openOrdersAddress(
    //     marketAddress,
    //     owner.publicKey,
    //     programID,
    //     proxyProgramID
    // );

    // console.log(owner.publicKey.toString())
      
    
    // const result = await OpenOrders.findForMarketAndOwner(connection, marketAddress, openOrdersAddressKey, programID)
    // console.log(result)
    // console.log(result[0].owner.toString())

    // const result2 = await OpenOrders.findForOwner(connection, openOrdersAddressKey, programID)
    // console.log(result2)
    
    

    // const bids = await myMarket.loadBids(connection)
    // console.log(bids)
    // for (let e of bids.slab.nodes) {
    //     if (e.leafNode === undefined) {
    //         continue
    //     }
    //     console.log(e.leafNode.owner.toString())
    //     console.log(e.leafNode.quantity.toString())
    // }

    // console.dir(bids, {depth: null})
    // const asks = await myMarket.loadAsks(connection)
    // console.dir(asks, {depth: null})

    // console.log(myMarket.asksAddress.toString())

    // const openOrderOfOwners = await myMarket.loadOrdersForOwner(connection, new web3.PublicKey('G1gnED8GCYrTdQ6w33VCteJ2JzEnBKxQ3Uj5HDngdoBU'))
    // // // console.log(openOrderOfOwners)
    // let promises = []
    // let countBuy = 0
    // let countSell = 0
    // for (let e of openOrderOfOwners) {
    //     countBuy += (e.side === 'buy')
    //     countSell += (e.side === 'sell')
    //     // console.log(e)
    //     promises.push(myMarket.cancelOrder(connection, owner, e))
    // }
    // const txHash = await Promise.all(promises)
    // console.log(txHash)
    // console.log(countBuy) // initial: 24
    // console.log(countSell) // initial: 35

    // const requestQueue = await myMarket.loadRequestQueue(connection)
    // console.log(requestQueue)

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
       
    // const txHash = await myMarket.matchOrders(connection, root)
    // console.log(txHash)

    const openOrdersAccount = await myMarket.findOpenOrdersAccountsForOwner(connection, openOrdersAddressKey)
    console.log(openOrdersAccount)
}

main()