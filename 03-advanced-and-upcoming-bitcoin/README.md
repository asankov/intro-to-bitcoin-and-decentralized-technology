# 3. Advanced & Upcoming Bitcoin

## Improved Backups

"Be Your Own Back" means you have full control over your keys and your money.
But it also means you also have the full responsibility for them and if you lose them or they get stolen you have to help desk to call.

A backup for each address is recommended.
However, since it's recommended to use a new address for each new transaction, this means a lot of addresses to be backup-ed.

### Deterministic wallet

This problem can be mitigated via deterministic wallet.
They make sure that each new address created can be inferred based on the initial one.
This way, the user of the wallet will only need to backup the initial wallet key and all the subsequent ones can be calculated based on that.

This looks like this:

```text
private_key_n = Hash(SEED | n)
```

Each private key is the hash of a seed and a number `n`.
Infinite number `n` means we can create infinite number of private keys deterministically.
In this case we only need to backup the `SEED`.

This seed can be a **mnemonic code** - 12 words which construct the hash.

## BIP - Bitcoin Improvement Proposal

The main way new Bitcoin features are proposed and evaluated.

<https://github.com/bitcoin/bips>

<https://bitcoincore.org> - information from core developers.

## Hierarchical Deterministic Wallets

**Problem:** An organization with a hierarchical structure needs to generate keys in a deterministic fashion without anyone being able to calculate the key of the people above/next to them.

**Solution:** Add a chain code to the private key formula:

```text
private_key_n = Hash(SEED | n | CHAIN_CODE)
```

This way the person at the top of the chain can generate the chain codes and need to know only them and the seed to be able to calculate all the keys of everyone below them.
No one will be able to calculate the keys of the people above them, because they will not know their chain code.

### Public Key Generation Without Private Keys

This also means that now we can generate public keys without knowing the private keys.

This is done via leveraging some Elliptic Curve math.

```text
Kpub = Kpri * G
(Kpri1 + Kpri2) * G = Kpri1 * G + Kpri2 * G
Kpri3 = Kpri1 + Kpri2
Kpub3
    = Kpri3 * G
    = (Kpri1 + Kpri2) * G
    = Kpri1 * G + Kpri2 * G
    = Kpub1 + Kpub2 ✅ generate Kpub3 without knowing Kpri3
```

A vulnerable exposed web server could use this formula:

```text
Kpub_n = Kpub_master + HASH(S | n)*G
```

to generate public keys without knowing the private key.
And we can be sure that even if the server is comprised we won't get our private keys stollen.

JS code to illustrate this workflow:

```js
const bitcore = require('bitcoin-lib');
const hdPrivateKeyTopLevel = new bitcore.HDPrivateKey();

const hdPrivateKeyDeptA = hdPrivateKeyTopLevel.derive(0, true);
const hdPrivateKeyDeptB = hdPrivateKeyTopLevel.derive(0, true);

const hdPrivateKeyDeptASub1 = hdPrivateKeyDeptA.derive(0);
const hdPrivateKeyDeptASub2 = hdPrivateKeyDeptA.derive(1);
const hdPrivateKeyDeptASub3 = hdPrivateKeyDeptA.derive(2);
const hdPrivateKeyDeptASub3Sub1 = hdPrivateKeyDeptASub3.derive(0);

const hdPrivateKeyDeptBExposedServer = hdPrivateKeyDeptB.derive(0);
// this can be put safely on the exposed server
const hdPublicKeyDeptBExposedServer = hdPrivateKeyDeptBExposedServer.hdPublicKey;

const hdReceivingPublicKey0 = hdPublicKeyDeptBExposedServer.derive(0);
const address0 = new bitcore.Address(hdReceivingPublicKey0.publicKey, "testnet");

const hdReceivingPublicKey1 = hdPublicKeyDeptBExposedServer.derive(1);
const address1 = new bitcore.Address(hdReceivingPublicKey1.publicKey, "testnet");

// on the secure server
const hdReceivingPrivateKey0 = hdPrivateKeyDeptBExposedServer.derive(0);
const hdReceivingPrivateKey1 = hdPrivateKeyDeptBExposedServer.derive(1);
```

## Multi-person Account Access

This is possible because Bitcoin transactions contains more than the addresses.
They can also contain a script which holds the logic that for example 2/3 account must approve the transaction before it is executed.

### Wallet Options

#### Case Wallet

Hardware wallet.
2/3 Signatures.
Device, Case service and separate backup company.

If you lose the device you can recover it, because the 3rd key is stored in the company.

#### GreenAddress

2/2 Signatures.

The second signature is in the company's hands.

#### Coinbase Wallet

They hold the private keys and the responsibility.

#### Mycelium and Electrun

You hold the private keys and the responsibility.

## Multisignature addresses for Escrow

This multisignatures functionality can be utilizied for trustless transactions.

For example, Bob wants to buy a painting from Charlie, but does not trust Charlie will send the painting.
Bob and Charlie agree to use a 3rd party (Alice) for an arbitrator.
Charlie constucts a **2/3 Public Key Script** (Alice, Bob and Charlie).
Bob hashes the **Public Key Script** and sends a payment to that address:

```text
Input:
    Bob's unspend output
    Bob's signature

Output:
    Hash(PubKeyScript) (ex: 39928a...)
    100BTC
```

### Case 1

There are no problem with the shipping and the painting.

Charlie constructs an Escrow redeem transaction:

```text
Input:
    Escrow funding txt output (39928a...)
    PubKeyScript
    Charlie's signature
Output:
    Charlie's address
```

He sends the transaction to Bob who adds his signature:

```text
Input:
    Escrow funding txt output (39928a...)
    PubKeyScript
    Charlie's signature
    Bob's signature
Output:
    Charlie's address
```

and everything is settled, without involving the arbitrator.

### Case 2

There is a problem with the shipping/painting.

Bob wants a refund, Charlie disagrees.
They call Alice as the arbitrator.
Alice decides to split the money between them, so she creates a new escrow transaction:

```text
Input:
    Escrow funding txt output (39928a...)
    PubKeyScript
    Alice's signature
Output:
    Bob 49 BTC
    Charlie 49 BTC
    Alice 2 BTC (arbitrator fee)
```

Now, anyone from Bob or Charlie can sign the transaction and it will be settled.

#### Case 2.1

If Bob and Charlie are not satisfied by the solution proposed by Alice they can create a transaction that lists another arbitrator and let him solve the issue.

In all these scenarios, at no point any one party had full control over the funds.

## Centralization Pressures

There are still some areas where Bitcoin is heavily centralized.

### Mining

There are big mining pools which control big parts of the Bitcoin mining powers.

### Transaction capacity

Current transaction limit: **~4 tx/ sec**, due to transaction and block sizes.

Transactions with higher fees are prioritized, hence transactions with lower fees become unsustainable, as some of them may never be processed.

A solution to this could be increasing the block size.
However, that will increase the cost of running a full Bitcoin node, and can further increase the centralization of the network.

### Software

Currently only a handfull of developers maintain the Bitcoin code/ website, etc.

The only real Bitcoin spec is the Bitcoin code.

Any node running non-official versions of the code can be ignored by the network.

## Hard vs. Soft forks

### Soft Fork

Software/rule change that produces blocks and transactions old software still accepts.

### Hard Fork

Software/rule change that produces blocks and transactions old software rejects as invalid.

## Segregated Witnesses

Proposal to extract the witnesses(signatures) out of the transactions in order to save space and make the signatures(scripts) more flexible.

## Payment Channels

Deposit-like mechanism for trustless interaction between a buyer and a seller.

### Example

Bob buys beers at Alice's bar.
Bob wants to buy the whole tab at the end of the night in one transaction, as opposed to one transaction per beer, in order to save on transaction fees.

**Problem:** How does Alice trust Bob that he will not run away without paying?

**Solution:**

Bob creates initial funding(deposit) transaction:

```text
Input:
    Bob's unspend amount
Output:
    Amount: 1BTC
    Spend conditions:
        Bob's public key
        Alice's public key
```

This transaction locks the funds in the spend condition which requires both Bob and Alice's signature.

First beer purchase:

```text
Input:
    Funding txt output
    Bob's signature
Output:
    Bob: 0.99BTC
    Alice: 0.01BTC
```

Alice can sign and broadcast this transaction and get the money for the beer.
Or Bob can buy another beer and create another transaction that will override the first one, because it is spending the same output:

```text
Input:
    Funding txt output
    Bob's signature
Output:
    Bob: 0.98BTC
    Alice: 0.02BTC
```

This pattern continues until Bob stops buying beers and tells Alice to sign and broadcast the final transaction.

At no point Alice was in risk of Bob not paying, because she could have signed the last transaction and got the money.

Bob was able to pay all the beers in one transaction, without paying many transaction fees, and without giving Alice a deposit she could have runned away with.

Alice and Bob exchanged many transactions between them, but in the end they only broadcasted and paid the fees of 2 transactions (the initial funding transaction and the final transaction).

**Caveats:** The initial funding transaction required both Alice and Bob's keys.
If Alice never responded Bob's money would have been locked away forever.

To mitigate this Bob could have initially created a refund transaction that would have been active after 24 hours as a safeguard against Alice disappearing.

```text
Input:
    Funding txt output
Output:
    Bob 1BTC
nLockTime:
    24h later
```

**Problem:** Since that transactions refers a transaction that is not yet on the blockchain (initial funding transaction), if the funding transaction is modified by a malicious server, before being added to the blockchain,, then the refund transaction would point to a non-existing transaction and will be basically useless.

**Solution:** Check Lock Time Verify

With this feature, the logic of these 2 transactions (initial funding transaction and refund transaction) can be combined into one:

```text
Input:
    Bob's unspend amount
Output:
    Amount: 1BTC
    Spend conditions - 2 of 2 Multisig with time-based logic:
    OP_IF
        <Alice's public key> OP_CHECKSIGVERIFY
    OP_ELSE
        <after 24h timestamp> OP_CHECKLOCKTIMEVERIFY OP_DROP
    OP_ENDIF
        <Bob's public key> OP_CHECKSIG
```

This means that the output is spendable if:

- Alice and Bob has signed
- Bob has signed and 24h have passed

This mechanism is extended further into **Lightning Network**.

This aims to reduce the on-chain transactions.

Also, this means transactions can be much faster, because they don't wait for blockchain confirmation.

## Replace by Fee

**Problem:** If you submit a transaction with too low fee, it can be ignored by the miners forever and never get processed.
You can submit a new transaction with a higher fee, but this can be seen as double spend and again, ignored by the miners.

**Solution:** Ability to change unconfirmed transactions.

**Drawback:** This will make unconfirmed transaction even more unreliable than they are now.






