const { PublicKey, Account, Connection } = require("@project-serum/anchor").web3;

const DEX_PID = new PublicKey("DSgEyE3kT8yK4Je9RSyQcPZrn6bao8nd7cq8KBtgyiz6");

// This msut be kept in sync with `scripts/localnet.sh`.
const PROGRAM_KP = new Account([47,235,139,202,27,239,15,90,85,141,229,196,193,131,150,91,52,224,169,47,243,118,4,64,79,224,58,137,119,176,105,62,184,224,34,19,219,212,112,54,193,106,123,10,42,140,0,182,111,36,146,187,21,46,171,206,41,201,168,70,252,87,43,67]);

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports = {
  sleep,
  DEX_PID,
  PROGRAM_KP
};
