# 2. How Bitcoin Works Under the Hood

## Software

Originally, the Bitcoin software was all-in-one.
One software was responsible for creating private keys and addresses, creating and signing transactions, the wallet functionality and solving proof-of-work puzzles.

Now that is split into 3 different softwares responsible for each of the 3 main tasks:

### Wallets/ Thin Clients

- Create private keys & addresses
- Create & sign transactions

### Full Node

- Wallet functionality
- Check & relay transactions
- Maintain full ledger

**Official software:** [Bitcoin Core](https://bitcoin.org/en/bitcoin-core/)

### Voters/ Miners

- Solve Proof-of-Work puzzle in voting process

### Software Libraries

- Create & interpret Bitcoin data

Available in all popular languages.

#### Using the Bitcore library

**Bitcore:** <https://bitcore.io/> <https://github.com/bitpay/bitcore#bitcore>

**Install the library:**

```sh
# install bitcore globally
npm install -g bitcore

# create a new project
mkdir bitcoin-project
cd bitcoin-project

# init npm project
npm init

# install bitcore-lib into the project
npm install bitcore-lib --save
```

**JS program that generated a Bitcoin address (private key):**

```js
const bitcore = require("bitcore-lib");

const randBuffer = bitcore.crypto.Random.getRandomBuffer(32);
const randNumber = bitcore.crypto.BN.fromBuffer(randBuffer);
// randNumber.toString(): '6338006631037776004326775822074709918333416093056471058088604598776041849477'

const address = new bitcore.PrivateKey(randNumber).toAddress();
// address: Address {network: Network {name: 'livenet', ...}, type: 'pubkeyhash'}

const testNetAddress = new bitcore.PrivateKey(randNumber).toAddress("testnet");
// testNetAddress: Address {network: Network {name: 'testnet', ...}, type: 'pubkeyhash'}
```

Run the code in full [here](code-samples/index.js).

## Digital Signatures

Based on Public Key Cryptography.

Each address is a Public Key.

The owner of the address can spend the funds in the address by generating a signature with its private key.
The signature can easily be verified by everyone knowing the public key.

Using the elliptic curve math we can easily calculate the public key from the private key, but not vice versa.

**Q:** What prevents finding someone else's private key?

**A:** There is unfathomably large number of possibilities - 10^48.

## Transactions

The ledger(blockchain) does not store balances, only transactions.

Each outgoing transaction must refer to an ingoing transaction for amount bigger or equal to the outgoing one.

Also, each new transaction need to spend the full amount of the linked transaction.

For example:

```text
Txn1 - Alice sends 5 BTC Bob.
Txn2 - Bob sends 3 BTC to Jim, referring Txn1 ❌ Invalid. 5 BTC needs to be spend
Txn2 - Bob sends 3 BTC to Jim, 2 BTC to Bob (change address) referring Txn1 ✅ Valid. 5 BTC are spend. 3 to Jim and 2 back to Bob
```

**Best practice:** Generate a new address for each transaction, including the change address.

### Creating a Transaction with Bitcore

Use <https://bitcoinfaucet.uo1.net/> to send some Bitcoins to your testnet address.

Check out the [example code](code-samples/index.js).

### Reaching Consensus on the Ledger

The voting system shows which ledger is supported by the majority.

Different transactions may reach different miners/bookkeepers in different order. This may lead to conflicts (like the double-spend problem).

#### Cryptographic Hashes

Bitcoin uses cryptographic hashes to sign transactions.
Hashes must be one-way - easy to compute from the original, but impossible to reverse the original from the hash.

Bitcoin uses SHA256 for this.
Walkthrough: <https://metamorphosite.com/one-way-hash-encryption-sha1-data-software/>.

The puzzle for the bookkeepers is exactly what hashes makes hard - finding an input for a given output.

#### How it works

New transactions are added to a pool of unconfirmed transactions.
Each miner selects a set of transactions and computes a hash of:

- the text of all transactions
- the previous block hash
- nonce

If the calculated hash matches the condition of the "puzzle" the block is accepted and added to the blockchain.

The only way to achieve that is to try multiple combinations (like throwing dice).

It is called blockchain, because each block contains the hash of the previous block.

From time to time, two miners find a solution simultaneously.
Hence a fork in the blockchain is formed.
In that case, the miners need to decide on which block to build the chain.
Sooner or later, one of the branches will grow faster than the other.
This branch will be accepted by the miners and the other will be discarded.
Because of this, it is possible for a transaction to be accepted, but later removed from the blockchain.
That is why, it's sensible to wait for a transaction to be confirmed at least 6 times (5 blocks are confirmed after the one the transaction is in).

## Bitcoin Creation

The miners are allowed to create a transaction that comes from nowhere and adds money to their accounts.
This is the Block Reward that rewards the minor that solved the block.

Block rewards halves every 4 years until 21 Million Bitcoins are produced.
No more Bitcoins will be produced from that point on.

Miners also get all fees for the transactions in the block.
That is why, it's sensible to include a fee in your transaction - transactions with higher fees have higher chance to be picked by the miners.

## Simplified Payment Verification (SPV) Wallets

Full Nodes hold the complete list of all transactions to ensure new transactions aren't double-spends.

SPV Wallets don't have that capability.
Instead the send a transaction hash to the Full Node and the Full Node sends back the block and subsequent block headers.

The Full Node sends a Merkle Tree of Transactions.

## Additional Resources

[Mastering Bitcoin](https://github.com/bitcoinbook/bitcoinbook) by Andreas Antonopoulos

[Developer documentation](https://bitcoin.org/en/developer-documentation)

[Source code: the only true spec](https://github.com/bitcoin/bitcoin)
