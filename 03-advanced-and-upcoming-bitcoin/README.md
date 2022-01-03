# 3. Advanced & Upcoming Bitcoin

## Improved Backups

"Be Your Own Back" means you have full control over your keys and your money.
But it also means you also have the full resposibility for them and if you lose them or they get stolen you have to help desk to call.

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
