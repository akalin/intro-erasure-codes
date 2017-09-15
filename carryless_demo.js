// @flow

'use strict';

/* :: import { carrylessAdd } from './carryless'; */
/* global carrylessAdd, HTMLInputElement */

const padStart = (
  s /* : string */,
  targetLength /* : number */,
  padString /* : string */
) /* : string */ => {
  if (s.length > targetLength) {
    return s;
  }

  const padLength = targetLength - s.length;
  let padding = padString;
  if (padLength > padding.length) {
    padding += padding.repeat(padLength / padding.length);
  }
  return padding.slice(0, padLength) + s;
};

// eslint-disable-next-line no-unused-vars
const startCarrylessAddDemo = (root /* : Element */) => {
  const [aInput, bInput] = root.querySelectorAll('input');

  if (
    !(aInput instanceof HTMLInputElement) ||
    !(bInput instanceof HTMLInputElement)
  ) {
    throw new Error('aInput or bInput unexpectedly not an HTMLInputElement');
  }

  const calcNode = root.querySelector('pre');
  if (calcNode === null) {
    throw new Error('calcNode unexpectedly null');
  }

  const calcOutput = calcNode.childNodes[0];
  const [binaryOutputNode, decimalOutputNode] = root.querySelectorAll(
    'span > span'
  );
  const [binaryOutput, decimalOutput] = [
    binaryOutputNode.childNodes[0],
    decimalOutputNode.childNodes[0],
  ];

  const onInput = () => {
    // TODO: Sanity-check a and b.
    const a = parseInt(aInput.value, 10);
    const b = parseInt(bInput.value, 10);
    const sum = carrylessAdd(a, b);

    const aDec = a.toString(10);
    const bDec = b.toString(10);
    const sumDec = sum.toString(10);

    const aBin = a.toString(2);
    const bBin = b.toString(2);
    const sumBin = sum.toString(2);

    const decPadLength = Math.max(aDec.length, bDec.length);

    const aDecPadded = padStart(aDec, decPadLength, ' ');
    const bDecPadded = padStart(bDec, decPadLength, ' ');
    const decSpacer = ' '.repeat(decPadLength);

    const binPadLength = Math.max(aBin.length, bBin.length, sumBin.length);

    const aBinPadded = padStart(aBin, binPadLength, ' ');
    const bBinPadded = padStart(bBin, binPadLength, ' ');
    const sumBinPadded = padStart(sumBin, binPadLength, ' ');
    const binDivider = '-'.repeat(binPadLength);

    calcOutput.nodeValue = `  a = ${aDecPadded} = ${aBinPadded}b
^ b = ${bDecPadded} = ${bBinPadded}b
      ${decSpacer}   ${binDivider}-
      ${decSpacer}   ${sumBinPadded}b`;
    binaryOutput.nodeValue = sumBin;
    decimalOutput.nodeValue = sumDec;
  };

  aInput.addEventListener('input', onInput);
  bInput.addEventListener('input', onInput);
};

/* :: export { startCarrylessAddDemo }; */
