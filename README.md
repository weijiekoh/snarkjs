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
require one more than 2 to the power of `n` G2 points. The output file
`12_g1_g2.hex` is a text file where the first 4097 lines are G1 points and the
last 4096 lines are the G2 points. The points are represented as the
concatentation of little-endian 32-byte values.

Take for example a set membership proving scheme which uses a KZG commitment as
an accumulator.  At least `(2 ^ n) + 1` G2 points are required to support up to
`2 ^ n` insertions. In this case, `12.ptau` should only be used
if the maximum number of insertions is `2 ^ 11 = 2048`.

The first G1 point is the G1 generator:

`01000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000`

Since the G1 generator is `x = 1, y = 2`, note that the above representation is
the x-coordinate in little-endian hexadecimal representation concatentated with
the y-coordinate in little-endian representation.

The first G2 point is the G2 generator:

`edf692d95cbdde46ddda5ef7d422436779445c5e66006a42761e1f12efde0018c212f3aeb785e49712e7a9353349aaf1255dfb31b7bf60723a480d9293938e19aa7dfa6601cce64c7bd3430c69e7d1e38f40cb8d8071ab4aeb6d8cdba55ec8125b9722d1dcdaac55f38eb37033314bbc95330c69ad999eec75f05f58d0890609`

For reference, EIP-197 describes the G2 generator as:

```
P2 = (
  11559732032986387107991004021392285783925812861821192530917403151452391805634 * i +
  10857046999023057135944570762232829481370756359578518086990519993285655852781,
  4082367875863433681332203403145435568316851327593401208105741076214120093531 * i +
  8495653923123431417604973247489272438418190587263600148770280649306958101930
)
```

Note that the hexadecimal representation starts with the little-endian
representation of
`10857046999023057135944570762232829481370756359578518086990519993285655852781`
which is `edf692d95cbdde46ddda5ef7d422436779445c5e66006a42761e1f12efde0018c`.
It is easy to mix up the order of the G2 x and y coordinates, and their
endianness, so we advise developers to be patient.
