// TODO: FLAG = 0 when not init yet.

const anchor = require("@project-serum/anchor");
const BN = anchor.BN;
const { Account, Transaction, SystemProgram } = anchor.web3;
const serumCmn = require("@project-serum/common");
const { TOKEN_PROGRAM_ID, Token } = require("@solana/spl-token");
const { PublicKey } = require("@solana/web3.js");

const DECIMALS = 6;

// Creates mints and a token account funded with each mint.
async function createMintGods(provider, mintCount) {
  // Setup mints with initial tokens owned by the provider.

  //! FLAG = 0
  let mintGods = [];
  // for (let k = 0; k < mintCount; k += 1) {
    // const [mint, god] = await serumCmn.createMintAndVault(
  //     provider,
  //     new BN("1000000000000000000"),
  //     undefined,
  //     DECIMALS
  //   );
  //   mintGods.push({ mint, god });
    
  //   console.log(`#${k} mint: ${mint} | god: ${god}`)
  // }

  //! FLAG = 1
  mintGods.push({
    mint: new PublicKey('FSGP998pcaWKBi9Dj7kpSam5UGXq1bF56Rvh3fXqa5bu'),
    god: new PublicKey('CAoXn1EbH2Zbni6LSESqz54mkmZEU2PWNS22komvxBuT')
  })

  mintGods.push({
    mint: new PublicKey('4GgE1ja9hRHZdPHnzYmteiNhbRZT1nmZWWJNwwYcc4kw'),
    god: new PublicKey('E6hvyW4sLZoY4A9DnguF762QcoU7re5pxjp3tYn6D4GK')
  })

  return mintGods;
}

async function createFundedAccount(provider, mints, newAccount) {
  //! FLAG = 0
  
  if (!newAccount) {
    newAccount = new Account();
  }

  console.log(`Marketmaker pubkey: ${newAccount.publicKey.toString()}`)

  const marketMaker = {
    tokens: {},
    account: newAccount,
  };

  // Transfer lamports to market maker.
  await provider.send(
    (() => {
      const tx = new Transaction();
      tx.add(
        SystemProgram.transfer({
          fromPubkey: provider.wallet.publicKey,
          toPubkey: newAccount.publicKey,
          lamports: 1000000000,
        })
      );
      return tx;
    })()
  );

  // Transfer SPL tokens to the market maker.
  for (let k = 0; k < mints.length; k += 1) {
    const { mint, god, amount } = mints[k];
    let MINT_A = mint;
    let GOD_A = god;
    // Setup token accounts owned by the market maker.
    const mintAClient = new Token(
      provider.connection,
      MINT_A,
      TOKEN_PROGRAM_ID,
      provider.wallet.payer // node only
    );
    const marketMakerTokenA = await mintAClient.createAccount(
      newAccount.publicKey
    );

    await provider.send(
      (() => {
        const tx = new Transaction();
        tx.add(
          Token.createTransferCheckedInstruction(
            TOKEN_PROGRAM_ID,
            GOD_A,
            MINT_A,
            marketMakerTokenA,
            provider.wallet.publicKey,
            [],
            amount,
            DECIMALS
          )
        );
        return tx;
      })()
    );

    marketMaker.tokens[mint.toString()] = marketMakerTokenA;
  }

  console.log(`OK funded MarketMaker with 2 Token`)
  
  

  //! FLAG = 1
  // const marketMaker = {
  //   account: newAccount,
  //   tokens: {
  //     'FSGP998pcaWKBi9Dj7kpSam5UGXq1bF56Rvh3fXqa5bu': new PublicKey('CAoXn1EbH2Zbni6LSESqz54mkmZEU2PWNS22komvxBuT'),
  //     '4GgE1ja9hRHZdPHnzYmteiNhbRZT1nmZWWJNwwYcc4kw': new PublicKey('E6hvyW4sLZoY4A9DnguF762QcoU7re5pxjp3tYn6D4GK')
  //   }
  // }
  // console.dir(marketMaker, {depth: null})

  return marketMaker;
}

module.exports = {
  createMintGods,
  createFundedAccount,
  DECIMALS,
};
