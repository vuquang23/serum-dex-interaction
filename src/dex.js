const Base58 = require('base-58')
const { genesis } = require('./utils')
const { Connection, Account, PublicKey, Keypair } = require('@project-serum/anchor').web3
const { Provider, Wallet } = require('@project-serum/anchor')
require('dotenv').config()

const PROXY_PROGRAMID = new PublicKey('EUdtZVeXMQoqZwyK8fFRoTMDbs9WwW1VAvkMDrdDhbnu')
const CONNECTION = new Connection('https://api.devnet.solana.com')
const WALLET = new Wallet(Keypair.fromSecretKey(Base58.decode(process.env.PRIVATEKEY)))
const PROVIDER = new Provider(CONNECTION, WALLET, {})

async function main() {
    await genesis({provider: PROVIDER, proxyProgramId: PROXY_PROGRAMID})
}

main()
