# `snarkjs powersoftau export hex`

This is a fork of [snarkjs](https://github.com/iden3/snarkjs) with the ability
to parse a `.ptau` file and write its `tauG1` and `tauG2` points in hexadecimal
representation.

After cloning this repository and navigating to the project root directory,
run:

```bash
npm i &&
npm run buildcli && \
node build/cli.cjs pteh path/to/12.ptau 12_g1_g2.hex
```

In the above example `12.ptau` is [Hermez Network's phase 1 trusted
setup](https://github.com/iden3/snarkjs#7-prepare-phase-2) (54 contributions
and a random beacon) with up to 4096 G2 points. Note that some constructions
require one more than 2 to the power of `n` G2 points.

Take for example a set membership proving scheme which uses a KZG commitment as
an accumulator.  At least `(2 ^ n) + 1` G2 points are required to support up to
`2 ^ n` insertions. In this case, `12.ptau` should only be used
if the maximum number of insertions is `2 ^ 11 = 2048`.
