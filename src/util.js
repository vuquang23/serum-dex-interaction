const Base58 = require('base-58')
const { genesis } = require('./utils')
const { Connection, Account, PublicKey, Keypair } = require('@project-serum/anchor').web3
const { Provider, Wallet } = require('@project-serum/anchor')
require('dotenv').config()

async function misc() {

    // const connection = new Connection('https://api.devnet.solana.com')
    // const info = await connection.getAccountInfo(new PublicKey('G1gnED8GCYrTdQ6w33VCteJ2JzEnBKxQ3Uj5HDngdoBU'))
    // console.log(info.owner.toString())
    const a = new Account(Base58.decode('4EHnNBG9jfvU2RE5bgXd9Fzn6bbKTnDdvVeQmJScpLTFyMyAy7QcLdnLuxEz7fqJLbHdZg6pZggGmumPX8hbA5Qg'))
    console.log(a.publicKey.toString())
}
  
misc()