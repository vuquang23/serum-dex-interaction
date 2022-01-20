const Base58 = require('base-58')
const { genesis } = require('./utils')
const { Connection, Account, PublicKey, Keypair } = require('@project-serum/anchor').web3
const { Provider, Wallet } = require('@project-serum/anchor')
require('dotenv').config()

async function misc() {
    const a = new Account()
    console.log(a.publicKey.toString())
    console.log(a)
}
  
misc()