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
    mint: new PublicKey('CDwqjuFgz5v9fmcGENJGHPr3aqnz8v1AEMWE8o6f3XXD'),
    god: new PublicKey('8LiQhj6V4Qss2bqTsLhRxgPS1jW9Y1qsdeyD8cQKAqEG')
  })

  mintGods.push({
    mint: new PublicKey('459PB7Cf1vipoLAUGzLxAe4eoiUahWtUux6LvCtDZHBA'),
    god: new PublicKey('Ef2hef6biXJvTwiQuME4guH8vek55RkV1TptPbnDzBa4')
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
      'CDwqjuFgz5v9fmcGENJGHPr3aqnz8v1AEMWE8o6f3XXD': new PublicKey('46kTRVJaqdecmpie9xnbRLJqewj5ix3aj2k8ZDWK5jqP'),
      '459PB7Cf1vipoLAUGzLxAe4eoiUahWtUux6LvCtDZHBA': new PublicKey('CTgEdEhfsxj6UxyFwRrEF9NG9G9tcwECRnfxo168jdgB')
    }
  }
  console.dir(marketMaker, {depth: null})

  return marketMaker;
}

module.exports = {
  createMintGods,
  createFundedAccount,
  DECIMALS,
};
