const { OpenOrders, Market, } = require('@project-serum/serum')
const { web3, Wallet } = require('@project-serum/anchor')
const Base58 = require('base-58')
const { PublicKey } = require('@solana/web3.js')
require('dotenv').config()

async function main() {
    // const root = web3.Keypair.fromSecretKey(Base58.decode(process.env.PRIVATEKEY))
    // const owner = new web3.Account([
    //     163,  58, 119,  31,   5, 241, 132, 148,  39, 144, 185,
    //      41,  32, 122, 236,  96, 122, 229,  94, 200,  70, 207,
    //      79, 116,  55, 184,  69,  91, 111, 249, 160,  19, 220,
    //       3, 230,  84, 237,  12,  32, 136, 182, 202, 187, 159,
    //      45, 224, 189, 184, 192,  77,  47,  23,  45,  71, 187,
    //      74, 231, 131, 105,  93, 223, 130, 222,  81
    // ])

    // console.log(owner.publicKey.toString())
      
    const connection = new web3.Connection("https://api.devnet.solana.com/")
    const marketAddress = new web3.PublicKey("2k2KoE784j2n4RWh6i5VKZbUekuGWh64HeDzki82sPUA")
    // const ownerAddress = new web3.PublicKey('G1gnED8GCYrTdQ6w33VCteJ2JzEnBKxQ3Uj5HDngdoBU') // open order account
    const programID = new web3.PublicKey('DSgEyE3kT8yK4Je9RSyQcPZrn6bao8nd7cq8KBtgyiz6')
    // const result = await OpenOrders.findForMarketAndOwner(connection, marketAddress, ownerAddress, programID)
    // const result2 = await OpenOrders.findForOwner(connection, ownerAddress, programID)
    // console.log(result)
    // console.log(result2)


    const myMarket = await Market.load(connection, marketAddress, {}, programID, undefined)

    const bids = await myMarket.loadBids(connection)
    console.log(bids)
    for (let e of bids.slab.nodes) {
        if (e.leafNode === undefined) {
            continue
        }
        console.log(e.leafNode.owner.toString())
        console.log(e.leafNode.quantity.toString())
    }

    // console.dir(bids, {depth: null})
    const asks = await myMarket.loadAsks(connection)
    console.dir(asks, {depth: null})

    // console.log(myMarket.asksAddress.toString())

    // const openOrderOfOwners = await myMarket.loadOrdersForOwner(connection, new web3.PublicKey('EmkyYyRBc9QyTamz5UPMhbsrdSTvHwKErz47cmY3rLNw'))
    // // // // console.log(openOrderOfOwners)
    // // let promises = []
    // let countBuy = 0
    // let countSell = 0
    // for (let e of openOrderOfOwners) {
    //     countBuy += (e.side === 'buy')
    //     countSell += (e.side === 'sell')
        
    //     console.log(e)
    //     // promises.push(myMarket.cancelOrder(connection, owner, e))
    // }
    // // const txHash = await Promise.all(promises)
    // // console.log(txHash)
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

    // const openOrdersAccount = await myMarket.findOpenOrdersAccountsForOwner(connection, new PublicKey('HCnAJhK9Ewn53j2L92sMhR8obHM1L6zkAPG93aDEtVqr'))
    // console.log(openOrdersAccount)
}

main()