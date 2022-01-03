const bitcore = require("bitcore-lib");

// create a new private key WIF
const privateKeyWIF = bitcore.PrivateKey("testnet").toWIF();
// const privateKeyWIF = "cPA4KpEyUEs17UpdRxQ3Y5Uis1TZfQwB4QV1VaB4NdwTCfZ5PfMU";
console.log("privateKeyWIF:", privateKeyWIF);

// create a new private key
const privateKey = bitcore.PrivateKey.fromWIF(privateKeyWIF);
console.log("privateKey:", privateKey.toString());

// get the public key from the private key
const publicKey = privateKey.publicKey;
console.log("publicKey:", publicKey.toString());

// get the address from the private key
const address = privateKey.toAddress();
console.log("address:", address.toString());

// generate a second address IN AN INSECURE WAY from a string
const value = new Buffer(
  "this is a way to generate an address from a string - risky"
);
const hash = bitcore.crypto.Hash.sha256(value);
const bn = bitcore.crypto.BN.fromBuffer(hash);
const address2 = new bitcore.PrivateKey(bn, "testnet").toAddress();

console.log("address2:", address2.toString());

const explorers = require("bitcore-explorers");
const insight = new explorers.Insight("https://explorer.btc.zelcore.io");

// get unspent utxos from the network
insight.getUnspentUtxos(address, (err, utxos) => {
  if (err) {
    console.log("error", err);
    return;
  }
  console.log("utxos", utxos.toString());

  // create a new transaction
  const tx = bitcore.Transaction();
  tx.from(utxos); // from the unspent transaction
  tx.to(address2, 50000); // to the second address we created for 50000 satoshis - 10000 remains
  tx.change(address); // the change address is the original address (not private)
  tx.fee(5000); // set the fee to 5000 satoshis - 5000 remains
  tx.sign(privateKey); // sign the transaction with our private key

  console.log("raw tx", tx);

  // see the input and output scripts of the transaction
  const scriptIn = bitcore.Script(tx.toObject().inputs[0].script);
  console.log("input script string: ", scriptIn.toString());

  const scriptOut = bitcore.Script(tx.toObject().outputs[0].script);
  console.log("output script string: ", scriptOut.toString());

  // optionally add some data to the transactions that will be stored on the blockchain forever
  tx.addData(null);

  // serialize the transaction
  console.log("tx", tx.serialize());

  // broadcast the transaction
  insight.broadcast(tx, (err, returnedTxId) => {
    if (err) {
      console.log("error", err);
      return;
    }

    console.log("successful broadcast:", returnedTxId);
  });
});
