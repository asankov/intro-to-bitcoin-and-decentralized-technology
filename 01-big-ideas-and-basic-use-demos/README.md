# 1. Big Ideas & Basic Use Demos

## Big Ideas

### Privacy & Pseudo-anonymity

When using Bitcoin you don't need to give your email or home address or any other information about yourself.
You just need a Bitcoin address and to know the Bitcoin address of the receiving party.

All transactions are anonymous, because they don't contain any personal info like name or address.
However, they do contain the Bitcoin address and if someone knows this address belongs to you the transaction can be traced back to you.

This is why Bitcoin is not fully anonymous, but pseudo-anonymous.

### Openness

All transactions are public and everyone can see them.

For example, on sites like <http://blockchain.info>.

### Cryptocurrency

Relies on cryptographic principles to secure the network.

For example, if Bob wants to send money to Alice the Transaction message will look like that:

```text
From: 19djf7... (Bob's BTC address)
To: 19a48e... (Alice's BTC address)
Amount: 5.2
Signature: 304502...
```

The **Signature** is this message is a Cryptographic Digital Signature that ensures that Bob is the one that send the message and that it's content is exactly what is says it is.

Digital Signature are based on public-key encryption.

Each Bitcoin address is a public key. It has a private key, which is mathematically related to it and it's used for signing the messages.

### Decentralization

Bitcoin has no single entity that operates the network (like banks, or PayPal).
It is operated by a group of peers (Peer-to-Peer network).

This is much more complex that a centralized system, but it provides its own benefits (and downsides).

Each centralized system has a single point of failure and can be a subject of:

- Internal abuse
- Attack
- Censorship

For example, many banks have caused hyper-inflation by printing large amounts of money.

### Trustless

Bookkeepers help maintain the network and verify transactions.

Allowed to add money to their accounts as an incentive for maintaining the network.
This is how Bitcoins are created.

#### How do we trust the Bookkeepers and how do they reach consensus?

Vote using **Proof of Work** - Bookkeepers use computing power to solve mathematical problems.
One vote happens ~ every 10 minutes.

Bookkeepers constructs block, based on the incoming transactions.
Each block contains the hash of the previous vote.

A single bookkeeper cannot change its balance, because the other bookkeepers will reject his chain, because it will be invalid (the signatures won't be valid).

Everyone can download and verify the whole blockchain at any time.

**Downside:** If you lose your private key, you lose your money.
Even the bookkeepers can't help you in that situation.

**Downside:** Decentralized network is not as efficient as a centralized one.
It is advisable to wait until an hour to make sure that a transaction is accepted into the blockchain.

**Downside:** Proof-of-work mechanism burns a lot of energy by design.

**Downside:** Slower to implement new features into the network, as majority of the bookkeepers will need to agree on them and run the new version of the software.

### Programmable Money

Program the logic behind the money flow (smart contracts).

Money are only received after a certain rule has been met.

## Bitcoin Hands-on: Acquiring, Storing, Sending & Receiving

### Acquiring

#### Exchanges

Like <https://coinbase.com>.

These exchanges are regulated by the government.

Bitcoin transactions are anonymous, but your use of exchanges is not, since exchanges need to comply with government rules to prevent terrorism financing, fraud and money laundering.
This is why the have implemented KYC (Know Your Customer) which means that you will need to verify your identity before using them.

#### ATMs

<https://coinatmradar.com>

Most work in one-direction: Cash in, BTC out.

High fees - can be up to 10%.

#### In person

<https://localbitcoins.com>

Meetups

#### Mining

Miners == bookkeepers

### Storing

#### Wallets - store, send & receive, list transactions

Can be Smartphone apps like **mycelium**, **airbitz** or online web-wallets like **blockchain.info** and **coinbase.com**.

In wallet apps like **mycelium**, **airbitz**, **blockchain.info** you are responsible for holding your private keys.
In **coinbase.com** the app holds your keys.

You can generate a paper wallet (private key) at sites like <https://bitaddress.org>.

Holding a bitcoin wallet is equivalent to holding the private key of one.

For large amount of Bitcoin it's recommended that you use a **cold storage** - private key that has never touched the internet.

There are also hardware wallets that help you shield your private keys from the internet.
They sign the transactions internally without exposing the private key to the internet.

**Always backup!**

### Accepting Bitcoin on a Website

Can be done with via platforms like <https://bitpay.com>.
They generate new address for each transaction and automatically transfer the balance to fiat.

Other platforms include <https://mycelium.com>.
The benefit there is that there is no 3rd party reliance and the wallet address is in the code.

Or you can just generate a QR code for your address and put it on your website.
This can be done on <https://bitcoinqrcode.org>.
