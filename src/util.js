const Base58 = require('base-58')
const { genesis } = require('./utils')
const { Connection, Account, PublicKey, Keypair } = require('@project-serum/anchor').web3
const { Provider, Wallet } = require('@project-serum/anchor')
require('dotenv').config()

async function misc() {
    const a = new Account([
        83, 142, 66, 242, 133, 85, 109, 48, 93, 182, 64,
        65, 23, 144, 248, 80, 165, 155, 176, 126, 242, 28,
        27, 172, 139, 53, 200, 226, 145, 147, 102, 115, 126,
        15, 97, 144, 87, 178, 236, 30, 167, 253, 101, 234,
        189, 108, 4, 4, 173, 0, 163, 78, 44, 185, 93,
        5, 177, 53, 70, 253, 20, 202, 39, 96
    ])
    console.log(a.publicKey.toString())
    console.log(a)
}

misc()