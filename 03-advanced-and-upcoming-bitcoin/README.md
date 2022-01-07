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

### Hierarchical Deterministic Wallets

**Problem:** An organization with a hierarchical structure needs to generate keys in a deterministic fashion without anyone being able to calculate the key of the people above/next to them.

**Solution:** Add a chain code to the private key formula:

```text
private_key_n = Hash(SEED | n | CHAIN_CODE)
```

This way the person at the top of the chain can generate the chain codes and need to know only them and the seed to be able to calculate all the keys of everyone below them.
No one will be able to calculate the keys of the people above them, because they will not know their chain code.

#### Public Key Generation Without Private Keys

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
