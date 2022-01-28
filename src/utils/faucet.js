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
    mint: new PublicKey('2h5YR2FXoQfy9RHbSXHqaWFyQ8vHEp1Pq6N6CpvZt3Cn'),
    god: new PublicKey('33QsjBpju1K5dusGqPkqmCktaBac3QBdcm6P24JmHKhf')
  })

  mintGods.push({
    mint: new PublicKey('7D2PLvMpcFfsseyzj7EfedvjwSN2tVmdjPmtmDKTFkUT'),
    god: new PublicKey('B1A1aVYHtaYtvmYTdChHxuBYsN7rpSTdBGdgWnDNTMFe')
  })

  return mintGods;
}

async function createFundedAccount(provider, mints, newAccount) {
  //! FLAG = 0
  /*
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
  
  */

  //! FLAG = 1
  const marketMaker = {
    account: newAccount,
    tokens: {
      '2h5YR2FXoQfy9RHbSXHqaWFyQ8vHEp1Pq6N6CpvZt3Cn': new PublicKey('4ZLPitgvgAXQbQ6q3u3ngujCTfRJY7Ew17cPtaBPh2vb'),
      '7D2PLvMpcFfsseyzj7EfedvjwSN2tVmdjPmtmDKTFkUT': new PublicKey('Ba8Zph7fXVWvDgDGxxSmLR5MuNeS4fvPVP6aWZKytpR4')
    }
  }
  // console.dir(marketMaker, {depth: null})

  return marketMaker;
}

module.exports = {
  createMintGods,
  createFundedAccount,
  DECIMALS,
};
